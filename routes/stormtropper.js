var express = require('express'),
	jwt     = require('jwt-simple'),
    config  = require('config'),
    moment  = require('moment'),
    router  = express.Router();

var mongoose = require('../db/mongoose');
var StormtropperModel = require('../models/StormtropperModel')(mongoose);
var StormtropperController = require('../controllers/StormtropperController')(StormtropperModel);

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

router.get('/', middlewareAuth, StormtropperController.getAll.bind(StormtropperController));
router.get('/:_id', middlewareAuth, StormtropperController.getById.bind(StormtropperController));
router.post('/', middlewareAuth, StormtropperController.create.bind(StormtropperController));
router.put('/:_id', middlewareAuth, StormtropperController.update.bind(StormtropperController));
router.delete('/:_id', middlewareAuth, StormtropperController.remove.bind(StormtropperController));

module.exports = router;