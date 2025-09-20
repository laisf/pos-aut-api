class Transfer {
  constructor() {
    this.transfers = [];
  }

  create(transferData) {
    const { fromUserId, toUserId, amount, description } = transferData;
    
    const transfer = {
      id: this.transfers.length + 1,
      fromUserId,
      toUserId,
      amount,
      description,
      status: 'completed',
      createdAt: new Date()
    };

    this.transfers.push(transfer);
    return transfer;
  }

  getByUserId(userId) {
    return this.transfers.filter(transfer => 
      transfer.fromUserId === userId || transfer.toUserId === userId
    );
  }

  getAll() {
    return this.transfers;
  }
}

module.exports = new Transfer();
