const User = require('../models/user');
const Account = require('../models/account');
const jwt = require('jsonwebtoken');
const async = require('async');

//get all users
exports.index = function (req, res) {
  User.find({})
    .exec(function (err, users) {
      if (err) {
        res.status(500).json({ error: "Unable to get user data. Please try again." })
      } else {
        res.json({
          users: users
        });
      }
    })
}

//get user data
exports.getUser = function (req, res) {
  async.parallel({
    user: function (callback) {
      User.findById(req.params.id, '_id, email fullName', callback);
    },
    accounts: function (callback) {
      Account.find({ user: req.params.id }, callback);
    }
  }, function (err, results) {
    if (err) {
      res.status(500)
        .json({
          error: "Couldn't find user data. Please try again."
        })
    } else {
      res.json({
        user: results.user,
        accounts: results.accounts
      });
    }
  })
}


exports.signUp = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const fullName = req.body.fullName;
  const user = new User({
    email: email,
    fullName: fullName,
    password: password,
    admin: false
  });
  user.save(function (err) {
    if (err) {
      res.status(500)
        .json({
          error: "Problem creating user. Please try again."
        })
    } else {
      returnToken(email, user._id, user.admin, user.fullName, res);
    }
  });
};

exports.login = function (req, res) {
  const { email, password } = req.body;
  User.findOne({ email }, function (err, user) {
    if (err) {
      res.status(500)
        .json({
          error: 'Server error, please try again.'
        });
    } else if (!user) {
      res.status(401)
        .json({
          error: 'No user exists with this email address.'
        });
    } else {
      user.isCorrectPassword(password, function (err, same) {
        if (err) {
          res.status(500)
            .json({
              error: 'Server error, please try again'
            });
        } else if (!same) {
          res.status(401)
            .json({
              error: 'Incorrect password.'
            });
        } else {
          // Issue token
          returnToken(email, user._id, user.admin, user.fullName, res);
        }
      });
    }
  });
}

exports.editUser = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const fullName = req.body.fullName;
  User.findOne({ _id: req.params.id }, function (err, user) {
    user.email = email;
    user.fullName = fullName;
    user.password = password;
    user.save(function (err) {
      if (err) {
        res.status(500)
          .json({
            error: "Problem updating user. Please try again."
          })
      } else {
        res.send("User updated")
      }
    });
  })
};

//return token and user info
const returnToken = (email, userId, admin, fullName, res) => {
  const payload = {
    email: email,
    id: userId
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '1h'
  });
  res.json({
    token: token,
    userId: userId,
    expiresIn: 3600,
    admin: admin,
    fullName: fullName
  });
}