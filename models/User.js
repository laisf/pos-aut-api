const bcrypt = require('bcryptjs');

class User {
  constructor() {
    this.users = [];
  }

  async create(userData) {
    const { email, password, name, isFavorecido = false } = userData;
    
    // Verificar se usuário já existe
    const existingUser = this.users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('Usuário já existe');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      id: this.users.length + 1,
      email,
      password: hashedPassword,
      name,
      isFavorecido,
      balance: 0,
      createdAt: new Date()
    };

    this.users.push(user);
    return { id: user.id, email: user.email, name: user.name, isFavorecido: user.isFavorecido, balance: user.balance };
  }

  findByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  findById(id) {
    return this.users.find(user => user.id === id);
  }

  getAll() {
    return this.users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      isFavorecido: user.isFavorecido,
      balance: user.balance,
      createdAt: user.createdAt
    }));
  }

  async updateBalance(userId, newBalance) {
    const user = this.findById(userId);
    if (user) {
      user.balance = newBalance;
      return true;
    }
    return false;
  }

  async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = new User();
