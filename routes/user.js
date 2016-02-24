var express = require('express'),
	jwt     = require('jwt-simple'),
    config  = require('config'),
    moment  = require('moment'),
    router  = express.Router();

// var mongoose = require('../db/mongoose');
// var UserModel = require('../models/UserModel');
var UserController = require('../controllers/UserController');

var middlewareAuth = function(request, response, next) {
	var token = request.query.token || request.headers['x-access-token'];
	if(!token) {
		var err = new Error('Forbidden');
		err.status = 403;
		return next(err);
	}
	try {
		var decoded = jwt.decode(token, config.get('jwtTokenSecret'));
		var isExpired = moment(decoded.exp).isBefore(new Date());
		if(isExpired) {
  			var err = new Error('Unauthorized');
  			err.status = 401;
  			return next(err);
		} else {
  			request.user = decoded.user;
  			console.log(request.user);
  			next();
		}
	} catch(err) {
		return next(err);
	}
};

router.get('/', middlewareAuth, UserController.getAll.bind(UserController));
router.get('/:_id', middlewareAuth, UserController.getById.bind(UserController));
router.post('/', middlewareAuth, UserController.create.bind(UserController));
router.post('/token', UserController.token.bind(UserController));
router.put('/:_id', middlewareAuth, UserController.update.bind(UserController));
router.delete('/:_id', middlewareAuth, UserController.remove.bind(UserController));

module.exports = router;