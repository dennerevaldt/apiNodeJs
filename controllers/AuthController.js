var debug   = require('debug')('api:controller:auth');
var jwt     = require('jwt-simple'),
    moment  = require('moment'),
    config  = require('config');

var Promise = require('bluebird');

function AuthController(UserModel) {
    this.model = Promise.promisifyAll(UserModel);
}

AuthController.prototype.token = function(request, response, next) {
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
    return new AuthController(UserModel);
};
