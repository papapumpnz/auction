var User = require('../models/User');
var nodemailer = require('nodemailer');
var async = require('async');
var passport = require('passport');
var jwt = require('json-web-token');
var config = require('config');

module.exports = function (auditLog,logger) {

  var token = require('../middlewares/token')(auditLog,logger);

  return {

    /**
     Token
     --------
     Accepts refresh token
     Returns an access token which is short lived
     **/
    token: function (req, res, next) {

      var params = {};
      params.expires = config.tokens.access.expires;
      params.issuer = config.tokens.access.issuer;
      params.secret = config.tokens.access.secret;
      params.type = 'access';
      params.userid = req.user.sub;
      params.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      token.tokenEncode(params, function (err, token) {
        if (err) {
          next(err);
        }
        auditLog.info("User %s authenticated with refresh token",req.user.sub,{id:req.user.sub,email:'',ip:req.headers['x-forwarded-for'] || req.connection.remoteAddress,msg_id:300});
        res.status(200);
        return res.json({"status": 200, "token": token});
      });
    },

    /**
     Validates an access token
     **/
    validate: function (req, res, next) {

      req.assert('token').notEmpty();

      var errors = req.validationErrors();
      if (errors) {
        res.status(400);
        return res.json({
          "status": 400,
          "message": errors
        });
      }

      tokenValue = req.body.token;

      token.tokenDecode(tokenValue,config.tokens.access.secret, function(err,decrypt) {
        if (err) {
          next(err);
        }
      });

      auditLog.info("User %s authenticated with access token",req.user.sub,{id:req.user.sub,email:'',ip:req.headers['x-forwarded-for'] || req.connection.remoteAddress,msg_id:310});
      res.status(200);
      return res.json({"status": 200, "valid": "true"});
    },

    /**
     Validates an service token
     **/
    validateService: function (req, res, next) {
      res.status(200);
      return res.json({"status": 200, "valid": "true"});
    }
  }
};
