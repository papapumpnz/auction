var User = require('../models/User');
var nodemailer = require('nodemailer');
var async = require('async');
var passport = require('passport');
var token = require('../middlewares/token');

module.exports = function (dbConfig) {

    return {

        /**
         Login
         ------
         Accepts email and password
         Returns a refresh token which is long lived
         **/
        login: function (req, res, next) {

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

            passport.authenticate('local', function (err, user, info) {
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

                if (!user.accountActive) {
                    res.status(423);
                    return res.json({
                        "status": 423,
                        "message": "Locked"
                    });
                }
                var params = {};
                params.expires = dbConfig.parameters['token.refresh.expires'].value;
                params.issuer = dbConfig.parameters['token.refresh.issuer'].value;
                params.secret = dbConfig.parameters['token.refresh.secret'].value;
                params.type = 'refresh';

                token.tokenEncode(user, params, function (err, token) {
                    if (err) {
                        return next(err);
                    }
                    user.refreshToken = token;
                    user.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        res.json({"status": 200, "token": token});
                    });
                });

            })(req, res, next);
        },

        /**
         Token
         --------
         Accepts refresh token
         Returns a refresh token which is long lived
         **/
        token: function (req, res, next) {

            var params = {};
            params.expires = dbConfig.parameters['token.refresh.expires'].value;
            params.issuer = dbConfig.parameters['token.refresh.issuer'].value;
            params.secret = dbConfig.parameters['token.refresh.secret'].value;
            params.type = 'token';

            tokenEncode(user, function (err, token) {
                if (err) {
                    return next(err);
                }
                res.json({"status": 200, "token": token});
            });
        },

        /**
         Index page
         Shows api for server
         **/
        index: function (req, res, next) {
            // load json api spec file
            var api_data = require('../static_data/api_ref.json');

            res.render('index', {
                data: api_data,
                limiter: {timeframe: process.env.RATE_LIMIT_LIFETIME_SECS, requests: process.env.RATE_LIMIT_RETRIES}
            });
        },

        /**
         Health check page
         Shows various stats about the server
         **/
        health: function (req, res, next) {
            res.status(200);
            res.json({
                "status": 200,
                "message": 'nothing here yet for health'
            });
        },

        /**
         * Register new user
         */
        register: function (req, res, next) {
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

            User.findOne({email: req.body.email}, function (err, existingUser) {
                if (existingUser) {
                    res.status(400);
                    res.json({
                        "status": 400,
                        "message": 'Account with that email address already exists.'
                    });
                }
                user.save(function (err) {
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
        }
    }
};