const userService = require('../services/userService');

class UserController {
  async register(req, res) {
    try {
      const user = await userService.register(req.body);
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      res.json({
        message: 'Login realizado com sucesso',
        ...result
      });
    } catch (error) {
      res.status(401).json({
        error: error.message
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = userService.getAllUsers();
      res.json({
        users,
        total: users.length
      });
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = userService.getUserById(parseInt(id));
      res.json({ user });
    } catch (error) {
      res.status(404).json({
        error: error.message
      });
    }
  }
}

module.exports = new UserController();
