const User = require('../models/user');

const checkAdmin = function (req, res, next) {
  const userId = req.body.adminId || req.query.userId;
  User.findById(userId, function (err, user) {
    if (err || user === null) {
      res.status(500)
        .json({
          error: 'Cannot match user Id to a valid account.'
        });
    } else if (!user.admin) {
      res.status(500)
        .json({
          error: 'You do not have permission to perform this task.'
        });
    } else {
      next();
    }
  });
}

module.exports = checkAdmin;