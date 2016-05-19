var User = require('../models/User');
var nodemailer = require('nodemailer');
var async = require('async');
var passport = require('passport');
var jwt = require('json-web-token');

module.exports = function (dbConfig,auditLog) {

  var token = require('../middlewares/token')(dbConfig,auditLog);

  return {

    /**
     Token
     --------
     Accepts refresh token
     Returns a auth token which is short lived
     **/
    token: function (req, res, next) {

      var params = {};
      params.expires = dbConfig.parameters['token.auth.expires'].value;
      params.issuer = dbConfig.parameters['token.auth.issuer'].value;
      params.secret = dbConfig.parameters['token.auth.secret'].value;
      params.type = 'auth';
      params.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      token.tokenEncode(params, function (err, token) {
        if (err) {
          callback(err,null);
        }
        res.json({"status": 200, "token": token});
      });
    },

    /**
     Validates a token
     **/
    validate: function (req, res, next) {
      res.json({"status": 200, "valid": "true"});
    }
  }
};
