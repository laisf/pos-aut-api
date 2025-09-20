const transferService = require('../services/transferService');

class TransferController {
  async createTransfer(req, res) {
    try {
      const { toUserId, amount, description } = req.body;
      const fromUserId = req.user.userId; // Vem do JWT

      const transfer = await transferService.createTransfer(
        fromUserId,
        toUserId,
        amount,
        description
      );

      res.status(201).json({
        message: 'Transferência realizada com sucesso',
        transfer
      });
    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }

  async getTransfersByUser(req, res) {
    try {
      const userId = req.user.userId; // Vem do JWT
      const transfers = transferService.getTransfersByUserId(userId);
      
      res.json({
        transfers,
        total: transfers.length
      });
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }

  async getAllTransfers(req, res) {
    try {
      const transfers = transferService.getAllTransfers();
      res.json({
        transfers,
        total: transfers.length
      });
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }
}

module.exports = new TransferController();
