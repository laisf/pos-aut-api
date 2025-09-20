const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../app');
const userService = require('../services/userService');
const transferService = require('../services/transferService');

chai.use(chaiHttp);
const expect = chai.expect;

describe('API Tests', () => {
  beforeEach(() => {
    // Limpar dados antes de cada teste
    const User = require('../models/User');
    const Transfer = require('../models/Transfer');
    User.users = [];
    Transfer.transfers = [];
  });

  describe('POST /users', () => {
    it('Validar que cria um novo usuário com sucesso', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123456',
        name: 'Test User',
        isFavorecido: false
      };

      const res = await chai.request(app)
        .post('/users')
        .send(userData);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('user');
      expect(res.body.user).to.have.property('id');
      expect(res.body.user.email).to.equal(userData.email);
    });

    it('Validar que retorna erro ao tentar criar usuário duplicado', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123456',
        name: 'Test User'
      };

      // Criar primeiro usuário
      await chai.request(app)
        .post('/users')
        .send(userData);

      // Tentar criar usuário com mesmo email
      const res = await chai.request(app)
        .post('/users')
        .send(userData);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Usuário já existe');
    });
  });

  describe('POST /users/login', () => {
    beforeEach(async () => {
      // Criar usuário para teste de login
      const userData = {
        email: 'test@example.com',
        password: '123456',
        name: 'Test User'
      };
      await chai.request(app)
        .post('/users')
        .send(userData);
    });

    it('Validar que faz login com sucesso e retorna token JWT', async () => {
      const loginData = {
        email: 'test@example.com',
        password: '123456'
      };

      const res = await chai.request(app)
        .post('/users/login')
        .send(loginData);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
      expect(res.body).to.have.property('user');
      expect(res.body.user.email).to.equal(loginData.email);
    });

    it('Validar que retorna erro com credenciais inválidas', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const res = await chai.request(app)
        .post('/users/login')
        .send(loginData);

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
    });
  });

  describe('POST /transfers', () => {
    let authToken;
    let fromUserId;
    let toUserId;

    beforeEach(async () => {
      // Criar usuários para teste
      const user1Data = {
        email: 'user1@example.com',
        password: '123456',
        name: 'User 1',
        isFavorecido: false
      };

      const user2Data = {
        email: 'user2@example.com',
        password: '123456',
        name: 'User 2',
        isFavorecido: false
      };

      // Criar usuários
      const user1Res = await chai.request(app)
        .post('/users')
        .send(user1Data);
      fromUserId = user1Res.body.user.id;

      const user2Res = await chai.request(app)
        .post('/users')
        .send(user2Data);
      toUserId = user2Res.body.user.id;

      // Fazer login para obter token
      const loginRes = await chai.request(app)
        .post('/users/login')
        .send({
          email: 'user1@example.com',
          password: '123456'
        });
      authToken = loginRes.body.token;

      // Adicionar saldo ao usuário
      const User = require('../models/User');
      const user = User.findById(fromUserId);
      user.balance = 10000;
    });

    it('Validar que cria transferência com sucesso', async () => {
      const transferData = {
        toUserId: toUserId,
        amount: 1000,
        description: 'Test transfer'
      };

      const res = await chai.request(app)
        .post('/transfers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(transferData);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('transfer');
      expect(res.body.transfer.amount).to.equal(1000);
    });

    it('Validar que retorna erro ao tentar transferir mais de R$ 5.000 para usuário não favorecido', async () => {
      const transferData = {
        toUserId: toUserId,
        amount: 6000,
        description: 'Test transfer'
      };

      const res = await chai.request(app)
        .post('/transfers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(transferData);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.include('R$ 5.000,00');
    });
  });

  describe('GET /users', () => {
    it('Validar que retorna lista de usuários', async () => {
      // Criar alguns usuários
      const user1Data = {
        email: 'user1@example.com',
        password: '123456',
        name: 'User 1'
      };

      const user2Data = {
        email: 'user2@example.com',
        password: '123456',
        name: 'User 2'
      };

      await chai.request(app).post('/users').send(user1Data);
      await chai.request(app).post('/users').send(user2Data);

      const res = await chai.request(app).get('/users');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('users');
      expect(res.body.users).to.be.an('array');
      expect(res.body.users).to.have.length(2);
    });
  });
});
