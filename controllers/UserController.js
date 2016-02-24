var debug = require('debug')('api:ctrluser');
var jwt   = require('jwt-simple'),
  moment  = require('moment'),
  config  = require('config');

var Promise = require('bluebird');
var UserModel = require('../models/UserModel');

var handleNotFound = function(data) {
    if(!data) {
        var err = new Error('Not Found');
        err.status = 404;
        throw err;
    }
    return data;
};

function UserController() {
    this.model = Promise.promisifyAll(UserModel);
}

UserController.prototype.getAll = function(request, response, next) {
  	this.model.findAsync({})
        .then(function(data) {
            response.json(data);
        })
    .catch(next);
};

UserController.prototype.getById = function(request, response, next) {
  	var _id = request.params._id;
  	this.model.findOneAsync(_id)
        .then(handleNotFound)
        .then(function(data){
            response.json(data);
        })
    .catch(next); 
};

UserController.prototype.create = function(request, response, next) {
  	var body = request.body;
  	this.model.createAsync(body)
        .then(function(err, data) {
            response.json(data);
        })
    .catch(next);
};

UserController.prototype.update = function(request, response, next) {
  	var _id = request.params._id,
       body = request.body;
  	this.model.updateAsync(_id, body)
        .then(function(err, data) {
            response.json(data);
        })
    .catch(next);
};

UserController.prototype.remove = function(request, response, next) {
  	var _id = request.params._id;
  	this.model.removeAsync(_id)
        .then(function(err, data) {
            response.json(data);
        })
    .catch(next);
};

UserController.prototype.token = function(request, response, next) {
    var username = request.body.username;
    var password = request.body.password;

    this.model.findAsync(request.body)
          .then(function(data) {
          
              if (data.length) {
                  var expires = moment().add(7, 'days').valueOf();
                  var token = jwt.encode({
                      user: username,
                      exp: expires
                  }, config.get('jwtTokenSecret'));

                  response.json({
                      token: token
                  });
              } else {
                  var err = new Error('Unauthorized');
                  err.status = 401;
                  next(err);
              }

          })
      .catch(next);
};

module.exports = function(UserModel) {
  	return new UserController(UserModel);
};