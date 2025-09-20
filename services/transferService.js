const User = require('../models/User');
const Transfer = require('../models/Transfer');

class TransferService {
  async createTransfer(fromUserId, toUserId, amount, description) {
    if (!fromUserId || !toUserId || !amount) {
      throw new Error('Dados obrigatórios não informados');
    }

    if (amount <= 0) {
      throw new Error('Valor deve ser maior que zero');
    }

    if (fromUserId === toUserId) {
      throw new Error('Não é possível transferir para si mesmo');
    }

    const fromUser = User.findById(fromUserId);
    const toUser = User.findById(toUserId);

    if (!fromUser) {
      throw new Error('Usuário remetente não encontrado');
    }

    if (!toUser) {
      throw new Error('Usuário destinatário não encontrado');
    }

    if (fromUser.balance < amount) {
      throw new Error('Saldo insuficiente');
    }

    // Regra: transferências para não favorecidos só podem ser até R$ 5.000,00
    if (!toUser.isFavorecido && amount > 5000) {
      throw new Error('Transferências para usuários não favorecidos só podem ser até R$ 5.000,00');
    }

    // Atualizar saldos
    const newFromBalance = fromUser.balance - amount;
    const newToBalance = toUser.balance + amount;

    await User.updateBalance(fromUserId, newFromBalance);
    await User.updateBalance(toUserId, newToBalance);

    // Criar transferência
    const transfer = Transfer.create({
      fromUserId,
      toUserId,
      amount,
      description
    });

    return transfer;
  }

  getTransfersByUserId(userId) {
    return Transfer.getByUserId(userId);
  }

  getAllTransfers() {
    return Transfer.getAll();
  }
}

module.exports = new TransferService();
