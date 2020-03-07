var express = require('express');
var router = express.Router();
const withAuth = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');
const accountController = require('../controllers/accountController');

/* CREATE account */
router.post('/', withAuth, checkAdmin, accountController.create);

//Get account data
router.get('/:id', withAuth, accountController.getAccount);

module.exports = router;
