var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const withAuth = require('../middleware/auth');

/* CREATE User */
router.post('/signup', function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const balance = 100
  const user = new User({
    email: email,
    password: password,
    balance: balance,
    admin: false
  });
  user.save(function (err) {
    if (err) {
      console.log(err.errmsg)
      res.status(500)
        .json({
          error: "Problem creating user. Please try again."
        })
    } else {
      returnToken(email, user._id, user.admin, user.balance, res);
    }
  });
});

//Log in User
router.post('/login', function (req, res) {
  const { email, password } = req.body;
  User.findOne({ email }, function (err, user) {
    if (err) {
      console.error(err);
      res.status(500)
        .json({
          error: 'Internal error please try again'
        });
    } else if (!user) {
      res.status(401)
        .json({
          error: 'Incorrect email or password'
        });
    } else {
      user.isCorrectPassword(password, function (err, same) {
        if (err) {
          res.status(500)
            .json({
              error: 'Internal error please try again'
            });
        } else if (!same) {
          res.status(401)
            .json({
              error: 'Incorrect email or password'
            });
        } else {
          // Issue token
          returnToken(email, user._id, user.admin, user.balance, res);
        }
      });
    }
  });
});

router.get('/checkToken', withAuth, function (req, res) {
  res.sendStatus(200);
})

//return token and user info
const returnToken = (email, userId, admin, balance, res) => {
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
    balance: balance
  });
}

router.get('/:id', withAuth, function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) {
      res.status(500)
        .json({
          error: 'Couldn\'t find user'
        });
    } else {
      res.json({
        userId: user._id,
        admin: user.admin,
        balance: user.balance
      });
    }
  });
});

module.exports = router;
