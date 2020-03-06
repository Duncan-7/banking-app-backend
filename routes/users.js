var express = require('express');
var router = express.Router();
const User = require('../models/user.js');
const withAuth = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');
const userController = require('../controllers/userController');

//Get Users
router.get('/', withAuth, checkAdmin, userController.index);

/* CREATE User */
router.post('/signup', withAuth, checkAdmin, userController.signUp);

//Log in User
router.post('/login', userController.login);

router.get('/checkToken', withAuth, function (req, res) {
  res.sendStatus(200);
})



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
