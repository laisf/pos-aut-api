const chai = require('chai');
const sinon = require('sinon');
const userController = require('../controllers/userController');
const userService = require('../services/userService');

const expect = chai.expect;

describe('UserController - Testes Isolados', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('register', () => {
    it('Validar que chama userService.register com dados corretos', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123456',
        name: 'Test User'
      };
      req.body = userData;

      const mockUser = { id: 1, email: userData.email, name: userData.name };
      const registerStub = sinon.stub(userService, 'register').resolves(mockUser);

      await userController.register(req, res);

      expect(registerStub.calledOnceWith(userData)).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({
        message: 'Usuário criado com sucesso',
        user: mockUser
      })).to.be.true;
    });

    it('Validar que retorna erro 400 quando userService.register falha', async () => {
      req.body = { email: 'test@example.com' };
      const error = new Error('Email, senha e nome são obrigatórios');
      const registerStub = sinon.stub(userService, 'register').rejects(error);

      await userController.register(req, res);

      expect(registerStub.calledOnce).to.be.true;
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: error.message })).to.be.true;
    });
  });

  describe('login', () => {
    it('Validar que chama userService.login com email e senha', async () => {
      const loginData = {
        email: 'test@example.com',
        password: '123456'
      };
      req.body = loginData;

      const mockResult = {
        token: 'mock-token',
        user: { id: 1, email: loginData.email }
      };
      const loginStub = sinon.stub(userService, 'login').resolves(mockResult);

      await userController.login(req, res);

      expect(loginStub.calledOnceWith(loginData.email, loginData.password)).to.be.true;
      expect(res.json.calledWith({
        message: 'Login realizado com sucesso',
        ...mockResult
      })).to.be.true;
    });

    it('Validar que retorna erro 401 quando userService.login falha', async () => {
      req.body = { email: 'test@example.com', password: 'wrong' };
      const error = new Error('Senha inválida');
      const loginStub = sinon.stub(userService, 'login').rejects(error);

      await userController.login(req, res);

      expect(loginStub.calledOnce).to.be.true;
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ error: error.message })).to.be.true;
    });
  });

  describe('getAllUsers', () => {
    it('Validar que chama userService.getAllUsers e retorna lista', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' }
      ];
      const getAllUsersStub = sinon.stub(userService, 'getAllUsers').returns(mockUsers);

      await userController.getAllUsers(req, res);

      expect(getAllUsersStub.calledOnce).to.be.true;
      expect(res.json.calledWith({
        users: mockUsers,
        total: mockUsers.length
      })).to.be.true;
    });
  });

  describe('getUserById', () => {
    it('Validar que chama userService.getUserById com ID correto', async () => {
      req.params.id = '123';
      const mockUser = { id: 123, email: 'test@example.com' };
      const getUserByIdStub = sinon.stub(userService, 'getUserById').returns(mockUser);

      await userController.getUserById(req, res);

      expect(getUserByIdStub.calledOnceWith(123)).to.be.true;
      expect(res.json.calledWith({ user: mockUser })).to.be.true;
    });

    it('Validar que retorna erro 404 quando usuário não encontrado', async () => {
      req.params.id = '999';
      const error = new Error('Usuário não encontrado');
      const getUserByIdStub = sinon.stub(userService, 'getUserById').throws(error);

      await userController.getUserById(req, res);

      expect(getUserByIdStub.calledOnceWith(999)).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: error.message })).to.be.true;
    });
  });
});
