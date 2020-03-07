var express = require('express');
var router = express.Router();
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

//edit User
router.post('/:id/edit', withAuth, userController.editUser);

//get user data
router.get('/:id', withAuth, userController.getUser);

module.exports = router;
