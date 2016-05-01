var User = require('../models/User');
var nodemailer = require('nodemailer');
var async = require('async');
var passport = require('passport');
var jwt = require('json-web-token');

/**
   Validates a token
**/
exports.validate = function(req, res,next) {
  res.json({"status" : 200, "message" : "ok"});
};
