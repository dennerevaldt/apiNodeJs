var express = require('express'),
  	router = express.Router();

var UserModel = require('../models/UserModel');
var AuthController = require('../controllers/AuthController')(UserModel);

// stormtropper
router.use('/stormtropper', require('./stormtropper'));

// user
router.use('/user', require('./user'));

router.post('/token', AuthController.token.bind(AuthController));

module.exports = router;
