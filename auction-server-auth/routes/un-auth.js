var User = require('../models/User');
var nodemailer = require('nodemailer');
var async = require('async');
var passport = require('passport');
var jwt = require('json-web-token');
var moment = require('moment')

/**
   Encode JWT token
**/
tokenEncode = function (user,cb) {
    currDate=new Date();
    expDate=new Date();
    expDate.setMinutes(currDate.getMinutes()+parseInt(process.env.TOKEN_EXPIRES_MINS));
    var payload = {
      "iss": process.env.TOKEN_ISSUER,
      "aud": process.env.TOKEN_AUDIENCE,
      "exp": moment(expDate).unix(),
      "iat": moment(currDate).unix(),
      "sub": user.id
    };
    
    //console.log(payload); 
    var secret = process.env.TOKEN_SECRET;

    jwt.encode(secret, payload, function (err, token) {
      if (err) {
        cb(err);
      } else {
        cb(null,token);
      }
    });
};

exports.auth = function(req, res,next) {

  req.assert('email').isEmail();
  req.assert('password').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
      res.status(401);
      return res.json({
        "status": 401,
        "message": errors
      });
  }
  
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(401);
      return res.json({
        "status": 401,
        "message": "Unauthorized"
      });
    }
    tokenEncode(user, function (err,token) {
      if (err) {
         return next(err);
      }
      res.json({"status" : 200, "token":token});
    });

  })(req, res, next);
};

/**
  Index page
  Shows api for server
**/
exports.index = function(req,res,next) {
  // load json api spec file
  var api_data = require('../static_data/api_ref.json');
  
  res.render('index', {
    data:api_data,
    limiter : {timeframe: process.env.RATE_LIMIT_LIFETIME_SECS, requests:process.env.RATE_LIMIT_RETRIES}
  });
};

/**
  Health check page
  Shows various stats about the server
**/
exports.health = function(req,res,next) {
  res.status(200);
  res.json({
    "status": 200,
    "message": 'nothing here yet for health'
  });
};


exports.register = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
      res.status(500);
      res.json({
        "status": 500,
        "message": errors
      });
  }

  var user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
        res.status(400);
        res.json({
            "status": 400,
            "message": 'Account with that email address already exists.'
        });
    }
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      res.status(200);
      res.json({
        "status": 200,
        "message": 'Account created'
      });
    });
  });
};