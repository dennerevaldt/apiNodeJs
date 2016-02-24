var debug = require('debug')('api:ctrlstormtropper');
var Promise = require('bluebird');

function StormtropperController(StormtropperModel) {
    this.model = Promise.promisifyAll(StormtropperModel);
}

StormtropperController.prototype.getAll = function(request, response, next) {
  	this.model.findAsync({})
        .then(function(data) {
            response.json(data);
        })
    .catch(next);
};

StormtropperController.prototype.getById = function(request, response, next) {
  	var _id = request.params._id;
  	this.model.findOneAsync(_id)
        .then(handleNotFound)
        .then(function(data){
            response.json(data);
        })
    .catch(next); 
};

StormtropperController.prototype.create = function(request, response, next) {
  	var body = request.body;
  	this.model.createAsync(body)
        .then(function(err, data) {
            response.json(data);
        })
    .catch(next);
};

StormtropperController.prototype.update = function(request, response, next) {
  	var _id = request.params._id,
       body = request.body;
  	this.model.updateAsync(_id, body)
        .then(function(err, data) {
            response.json(data);
        })
    .catch(next);
};

StormtropperController.prototype.remove = function(request, response, next) {
  	var _id = request.params._id;
  	this.model.removeAsync(_id)
        .then(function(err, data) {
            response.json(data);
        })
    .catch(next);
};

module.exports = function(StormtropperModel) {
  	return new StormtropperController(StormtropperModel);
};

/**
 * privates
 */
 
var handleNotFound = function(data) {
    if(!data) {
        var err = new Error('Not Found');
        err.status = 404;
        throw err;
    }
    return data;
};