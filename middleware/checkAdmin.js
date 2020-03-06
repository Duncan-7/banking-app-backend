const User = require('../models/user');

const checkAdmin = function (req, res, next) {
  User.findById(req.body.userId, function (err, user) {
    if (err || user === null) {
      res.status(500)
        .json({
          error: 'Cannot find user'
        });
    } else if (!user.admin) {
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