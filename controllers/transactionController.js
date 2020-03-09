const Account = require('../models/account');
const Transaction = require('../models/transaction');
const async = require('async');
const mongoose = require('mongoose');

//create new transaction
exports.create = async function (req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const target = await Account.findOne({ accountNumber: req.body.targetAccountNumber }).session(session);
    const sender = await Account.findById(req.body.sourceAccountId).session(session);

    const transaction = new Transaction({
      sourceAccountId: req.body.sourceAccountId,
      targetAccountId: target._id,
      amount: req.body.amount
    });

    sender.currentBalance = sender.currentBalance - transaction.amount;
    target.currentBalance = target.currentBalance + transaction.amount;

    await transaction.save();
    await sender.save();
    await target.save();

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: "Transaction unsuccessful. Please check account number and try again." });
    throw error;
  } finally {
    session.endSession();
    res.send("transfer completed");
  }
}