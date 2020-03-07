const User = require('../models/user');
const Account = require('../models/account');
const Transaction = require('../models/transaction');
const async = require('async');

//create new account
exports.create = function (req, res) {
  const account = new Account({
    user: req.body.user,
    accountNumber: req.body.accountNumber,
    currentBalance: req.body.currentBalance,
  });
  account.save(function (err) {
    if (err) {
      res.status(500)
        .json({
          error: "Problem creating user. Please try again."
        })
    } else {
      res.send("Account Created");
    }
  })
}

//get account data
exports.getAccount = function (req, res) {
  async.parallel({
    account: function (callback) {
      Account.findById(req.params.id, callback);
    },
    transactions: function (callback) {
      Transaction.find({
        $or: [
          { sourceAccountId: req.params.id },
          { targetAccountId: req.params.id }
        ]
      }, callback);
    }
  }, function (err, results) {
    console.log(results)
    if (err) {
      res.status(500)
        .json({
          error: err
        })
    } else {
      res.json({
        account: results.account,
        transactions: results.transactions
      });
    }
  })
}