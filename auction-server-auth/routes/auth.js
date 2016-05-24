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
     Returns an access token which is short lived
     **/
    token: function (req, res, next) {

      var params = {};
      params.expires = dbConfig.parameters['token.access.expires'].value;
      params.issuer = dbConfig.parameters['token.access.issuer'].value;
      params.secret = dbConfig.parameters['token.access.secret'].value;
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

      token.tokenDecode(tokenValue,dbConfig.parameters['token.access.secret'].value, function(err,decrypt) {
        if (err) {
          next(err);
        }
        console.log(decrypt) ;
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
