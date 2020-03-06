const User = require('../models/user');
const jwt = require('jsonwebtoken');

//get all users
exports.index = function (req, res) {
  User.find({})
    .exec(function (err, users) {
      if (err) {
        console.log(users)
      } else {
        res.json({
          users: users
        });
      }
    })
}

//get user data
exports.getUser = function (req, res) {
  User.findById(req.params.id)
    .exec(function (err, user) {
      if (err) {
        //handle error
      } else {
        res.json({
          user: user
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
          returnToken(email, user._id, user.admin, user.fullName, res);
        }
      });
    }
  });
}

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