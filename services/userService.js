const jwt = require('jsonwebtoken');
const User = require('../models/User');

class UserService {
  async register(userData) {
    const { email, password, name, isFavorecido } = userData;
    
    if (!email || !password || !name) {
      throw new Error('Email, senha e nome são obrigatórios');
    }

    return await User.create({ email, password, name, isFavorecido });
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    const user = User.findByEmail(email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const isValidPassword = await User.validatePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Senha inválida');
    }

    // Gerar JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isFavorecido: user.isFavorecido,
        balance: user.balance
      }
    };
  }

  getAllUsers() {
    return User.getAll();
  }

  getUserById(id) {
    const user = User.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isFavorecido: user.isFavorecido,
      balance: user.balance,
      createdAt: user.createdAt
    };
  }
}

module.exports = new UserService();
