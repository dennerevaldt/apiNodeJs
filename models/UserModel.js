'use strict';

var mongoose = require('../db/mongoose');

function UserDAO(model) {
	this.model = model;
}

UserDAO.prototype.create = function(data, callback) {
  	var model = new this.model(data);
	model.save(function(err, result) {
		callback(err, result);
	});
};

UserDAO.prototype.find = function(query, callback) {
	this.model.find(query).exec(callback);
};

UserDAO.prototype.findOne = function(_id, callback) {
	var query = { _id : _id };
	this.model.findOne(query).exec(callback);
};

UserDAO.prototype.update = function(_id, data, callback) {
	var query = { _id : _id };
	this.model.update(query, data).exec(function(err, result) {
		callback(err, result);
	});
};

UserDAO.prototype.remove = function(_id, callback) {
	var query = { _id : _id };
	this.model.remove(query).exec(function(err, result) {
	    callback(err, result);
  	});
};

var User = mongoose.model('User', {
    username: String,
    password: String
});
module.exports = new UserDAO(User);
