const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../app');
const userService = require('../services/userService');
const transferService = require('../services/transferService');

chai.use(chaiHttp);
const expect = chai.expect;

describe(' Risk-Based Testing - Critical Scenarios', () => {
  beforeEach(() => {
    // Limpar dados antes de cada teste
    const User = require('../models/User');
    const Transfer = require('../models/Transfer');
    User.users = [];
    Transfer.transfers = [];
  });

  describe(' Security Risks', () => {
    it('Validar que rejeita tokens JWT expirados ou malformados', async () => {
      const invalidTokens = [
        'invalid-token',
        'Bearer invalid',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid',
        '',
        null
      ];

      for (const token of invalidTokens) {
        const res = await chai.request(app)
          .post('/transfers')
          .set('Authorization', token)
          .send({ toUserId: 1, amount: 100 });

        // A API retorna 401 para tokens ausentes e 403 para tokens inválidos
        expect(res.status).to.be.oneOf([401, 403]);
        expect(res.body).to.have.property('error');
      }
    });

    it('Validar que aceita inputs com caracteres especiais (não há sanitização)', async () => {
      const specialInput = {
        email: 'test@example.com',
        password: '123456',
        name: '<script>alert("xss")</script>'
      };

      const res = await chai.request(app)
        .post('/users')
        .send(specialInput);

      expect(res).to.have.status(201);
      // A API não sanitiza inputs, então o script permanece
      expect(res.body.user.name).to.include('<script>');
    });
  });

  describe(' Financial Integrity Risks', () => {
    it('Validar que rejeita transferências com valores zero (comportamento atual)', async () => {
      // Criar usuários
      const user1 = await chai.request(app).post('/users').send({
        email: 'user1@example.com', password: '123456', name: 'User 1'
      });
      const user2 = await chai.request(app).post('/users').send({
        email: 'user2@example.com', password: '123456', name: 'User 2'
      });

      const login = await chai.request(app).post('/users/login').send({
        email: 'user1@example.com', password: '123456'
      });

      // Adicionar saldo
      const User = require('../models/User');
      const user = User.findById(user1.body.user.id);
      user.balance = 1000;

      // A API rejeita valor zero (comportamento atual)
      const res = await chai.request(app)
        .post('/transfers')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send({ toUserId: user2.body.user.id, amount: 0 });

      expect(res).to.have.status(400);
    });

    it('Validar que mantém consistência em operações concorrentes', async () => {
      // Criar usuários
      const user1 = await chai.request(app).post('/users').send({
        email: 'user1@example.com', password: '123456', name: 'User 1'
      });
      const user2 = await chai.request(app).post('/users').send({
        email: 'user2@example.com', password: '123456', name: 'User 2'
      });

      const login = await chai.request(app).post('/users/login').send({
        email: 'user1@example.com', password: '123456'
      });

      // Adicionar saldo
      const User = require('../models/User');
      const user = User.findById(user1.body.user.id);
      user.balance = 1000;

      // Simular transferências simultâneas
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          chai.request(app)
            .post('/transfers')
            .set('Authorization', `Bearer ${login.body.token}`)
            .send({ toUserId: user2.body.user.id, amount: 100 })
        );
      }

      const responses = await Promise.all(promises);
      
      // Verificar que todas as transferências foram processadas
      const successful = responses.filter(res => res.status === 201);
      expect(successful.length).to.equal(5);

      // Verificar saldo final
      const finalUser = User.findById(user1.body.user.id);
      expect(finalUser.balance).to.equal(500); // 1000 - (5 * 100)
    });
  });

  describe(' Performance Risks', () => {
    it('Validar que processa múltiplas requisições sem degradação', async () => {
      const startTime = Date.now();
      
      // Criar múltiplos usuários simultaneamente
      const promises = [];
      for (let i = 0; i < 20; i++) {
        promises.push(
          chai.request(app).post('/users').send({
            email: `user${i}@example.com`,
            password: '123456',
            name: `User ${i}`
          })
        );
      }

      const responses = await Promise.all(promises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Verificar que todas as requisições foram bem-sucedidas
      const successful = responses.filter(res => res.status === 201);
      expect(successful.length).to.equal(20);
      
      // Verificar que não demorou mais que 5 segundos
      expect(duration).to.be.lessThan(5000);
    });
  });

  describe(' Business Logic Risks', () => {
    it('Validar que aplica regras de negócio para usuários favorecidos', async () => {
      // Criar usuário favorecido
      const favorecido = await chai.request(app).post('/users').send({
        email: 'favorecido@example.com',
        password: '123456',
        name: 'Favorecido',
        isFavorecido: true
      });

      const normal = await chai.request(app).post('/users').send({
        email: 'normal@example.com',
        password: '123456',
        name: 'Normal'
      });

      const login = await chai.request(app).post('/users/login').send({
        email: 'normal@example.com', password: '123456'
      });

      // Adicionar saldo
      const User = require('../models/User');
      const user = User.findById(normal.body.user.id);
      user.balance = 10000;

      // Transferir valor alto para favorecido (deve funcionar)
      const res1 = await chai.request(app)
        .post('/transfers')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send({ toUserId: favorecido.body.user.id, amount: 8000 });

      expect(res1).to.have.status(201);

      // Transferir valor alto para não favorecido (deve falhar)
      const res2 = await chai.request(app)
        .post('/transfers')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send({ toUserId: normal.body.user.id, amount: 6000 });

      expect(res2).to.have.status(400);
    });

    it('Validar que retorna códigos de status HTTP apropriados', async () => {
      // 404 - Usuário não encontrado
      const res1 = await chai.request(app).get('/users/999');
      expect(res1).to.have.status(404);

      // 400 - Dados inválidos
      const res2 = await chai.request(app).post('/users').send({
        email: 'invalid-email'
      });
      expect(res2).to.have.status(400);

      // 404 - Rota não encontrada
      const res3 = await chai.request(app).get('/invalid-route');
      expect(res3).to.have.status(404);
    });
  });

  describe(' Data Consistency Risks', () => {
    it('Validar que mantém consistência após falhas em transferências', async () => {
      // Criar usuários
      const user1 = await chai.request(app).post('/users').send({
        email: 'user1@example.com', password: '123456', name: 'User 1'
      });
      const user2 = await chai.request(app).post('/users').send({
        email: 'user2@example.com', password: '123456', name: 'User 2'
      });

      const login = await chai.request(app).post('/users/login').send({
        email: 'user1@example.com', password: '123456'
      });

      // Adicionar saldo
      const User = require('../models/User');
      const user = User.findById(user1.body.user.id);
      user.balance = 1000;

      // Tentar transferência com valor maior que o saldo
      const res = await chai.request(app)
        .post('/transfers')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send({ toUserId: user2.body.user.id, amount: 2000 });

      expect(res).to.have.status(400);
      
      // Verificar que o saldo não foi alterado
      const userAfter = User.findById(user1.body.user.id);
      expect(userAfter.balance).to.equal(1000);
    });

    it('Validar que registra todas as transferências corretamente', async () => {
      // Criar usuários
      const user1 = await chai.request(app).post('/users').send({
        email: 'user1@example.com', password: '123456', name: 'User 1'
      });
      const user2 = await chai.request(app).post('/users').send({
        email: 'user2@example.com', password: '123456', name: 'User 2'
      });

      const login = await chai.request(app).post('/users/login').send({
        email: 'user1@example.com', password: '123456'
      });

      // Adicionar saldo
      const User = require('../models/User');
      const user = User.findById(user1.body.user.id);
      user.balance = 1000;

      // Fazer transferência
      await chai.request(app)
        .post('/transfers')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send({ toUserId: user2.body.user.id, amount: 500, description: 'Test transfer' });

      // Verificar se a transferência foi registrada
      const Transfer = require('../models/Transfer');
      const transfers = Transfer.getByUserId(user1.body.user.id);
      expect(transfers).to.have.length(1);
      expect(transfers[0].amount).to.equal(500);
      expect(transfers[0].description).to.equal('Test transfer');
    });
  });
});
