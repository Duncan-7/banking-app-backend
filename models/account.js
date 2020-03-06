const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    accountNumber: { type: Number, required: true, unique: true },
    currentBalance: { type: Number }
  }
)

module.exports = mongoose.model('Account', AccountSchema);