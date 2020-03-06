const User = require('../models/user');

const checkAdmin = function (req, res, next) {
  const userId = req.body.userId || req.query.userId;
  console.log(userId)
  User.findById(userId, function (err, user) {
    if (err || user === null) {
      console.log("error 1")
      res.status(500)
        .json({
          error: 'Cannot find user'
        });
    } else if (!user.admin) {
      console.log("error 2")
      res.status(500)
        .json({
          error: 'You do not have permission to perform this task'
        });
    } else {
      next();
    }
  });
}

module.exports = checkAdmin;