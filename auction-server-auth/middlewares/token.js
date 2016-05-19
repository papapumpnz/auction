var _ = require('underscore');
var moment = require('moment');
var jwt = require('json-web-token');            // https://www.npmjs.com/package/json-web-token
var User = require('../models/User');


module.exports = function (dbConfig,auditLog) {

    return {

        /**
         Encode JWT token
         params as list of params to encode
         type is refresh, auth, service
         **/
        tokenEncode: function (params, cb) {
            currDate = new Date();
            expDate = new Date();
            expDate.setMinutes(currDate.getMinutes() + parseInt(params.expires));
            if (!_.contains(['refresh', 'auth','service'], params.type)) {                      // check type of token is refresh, auth or service
                params.type = 'refresh';
            }
            var payload = {
                "iss": params.issuer,
                "exp": moment(expDate).unix(),
                "iat": moment(currDate).unix(),
                "sub": params.userid,
                "type": params.type,
                "rti" : params.refreshToken,
                "ip" : params.ip
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

        // TODO : Make this more secure

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
            secret = null;
            if (payload) {
                if (payload.type == 'refresh') {
                    secret = dbConfig.parameters['token.refresh.secret'].value;
                } else if (payload.type == 'auth') {
                    secret = dbConfig.parameters['token.auth.secret'].value;
                }
                return done(null, secret);
            }
            return done('invalid token', null);
        },

        /*
        * isRevokedCallback
        * Checks token payload for a valid:
        *       sub = users id against db
        *       rti = users fresh token in db
        *       ip = users lastIp in db
        *       also checks the user account is active
        */
        isRevokedCallback: function (req, payload, done) {

            if (payload) {
                var tokenUserId = payload.sub;
                var tokenId = payload.rti;
                var tokenIp = payload.ip;
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

                User.findById(tokenUserId).exec(function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    /*
                    * Begin token validation
                    */

                    if (dbConfig.parameters['token.refresh.enforce.valid.ip'].value) {
                        if (tokenIp != ip) {
                            // ip enforcement on and tokens ip != users.lastIp
                            return done(null, true);
                        }
                    }
                    if (!user) {
                        // we dont have a valid user
                        return done(null, true);
                    }
                    if (!user.accountActive) {
                        // user account is inactive
                        return done(null, true);
                    }
                    if (tokenId != user.refreshToken) {
                        // users refreshToken != tokens refresh token id
                        return done(null, true);
                    }
                    // user ok and token ok
                    return done(null, false);
                });
            } else {
                // something went wrong, we dont have a token payload so return 401
                return done(null, true);
            }
        }
    };
};