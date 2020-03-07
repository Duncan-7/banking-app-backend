var express = require('express');
var router = express.Router();
const withAuth = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');
const transactionController = require('../controllers/transactionController');

/* CREATE transaction */
router.post('/', withAuth, transactionController.create);

module.exports = router;
