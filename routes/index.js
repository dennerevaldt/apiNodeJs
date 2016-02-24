var express = require('express'),
	router = express.Router();

// stormtropper
router.use('/stormtropper', require('./stormtropper'));

// user
router.use('/user', require('./user'));

module.exports = router;