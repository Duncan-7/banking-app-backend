const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    sourceAccountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    targetAccountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    amount: { type: Number, required: true},
    date: {type: Date, default: Date.now() }
  }
)

module.exports = mongoose.model('Transaction', TransactionSchema);