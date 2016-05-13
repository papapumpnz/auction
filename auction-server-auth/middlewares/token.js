var _ = require('underscore');
var moment = require('moment');
var jwt = require('json-web-token');            // https://www.npmjs.com/package/json-web-token
var User = require('../models/User');


module.exports = function (dbConfig) {

    return {

        /**
         Encode JWT token
         user is user object
         type is refresh or auth
         **/
        tokenEncode: function (user, params, cb) {
            currDate = new Date();
            expDate = new Date();
            expDate.setMinutes(currDate.getMinutes() + parseInt(params.expires));
            if (!_.contains(['refresh', 'auth'], params.type)) {                      // check type of token is refresh or auth
                params.type = 'refresh';
            }
            var payload = {
                "iss": params.issuer,
                "exp": moment(expDate).unix(),
                "iat": moment(currDate).unix(),
                "sub": user.id,
                "type": params.type,
                "jti" : params.refreshToken
            };

            jwt.encode(params.secret, payload, function (err, token) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, token);
                }
            });
        },

        /*
         * Decode a JWT token
         * 
         */
        tokenDecode: function (token, secret, cb) {
            jwt.decode(secret, token, function (err_, decode) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, decode);
                }
            });
        },

        /*
        * Generates a random token
        */
        randomToken: function(length,cb) {
            var token = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for(var i = 0; i < length; i++) {
                token += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return cb(token);
        },
        
        /**
         * extracts token from web request
         */
        getToken: function fromHeaderOrQuerystring(req) {
            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                return req.headers.authorization.split(' ')[1];
            } else if (req.query && req.query.token) {
                return req.query.token;
            }
            return null;
        },

        /**
         * Returns secret key using issuer from token
         */
        secretCallback: function (req, payload, done) {

            if (payload.type == 'refresh') {
                secret = dbConfig.parameters['token.refresh.secret'].value;
            } else if (payload.type == 'auth') {
                secret = dbConfig.parameters['token.auth.secret'].value;
            } else {
                secret = null;
            }

            return done(null, secret);
        },

        isRevokedCallback: function (req, payload, done) {
            var userId = payload.sub;
            var tokenId = payload.jti;

            User.findOne({_id: userId}).exec(function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user || !user.accountActive || tokenId != user.refreshToken) {
                    // no user, or account suspended, or no refresh token/token not match
                    return done(null, true)
                } else {
                    // user ok and token ok
                    return done(null, false)
                }
            });
        }
    };
};