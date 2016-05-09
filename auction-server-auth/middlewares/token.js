var _ = require('underscore');
var moment = require('moment');
var jwt = require('json-web-token');


/**
 Encode JWT token
 user is user object
 type is refresh or auth
 **/
exports.tokenEncode = function (user,params,cb) {
    currDate=new Date();
    expDate=new Date();
    expDate.setMinutes(currDate.getMinutes()+parseInt(params.expires));
    if (!_.contains(['refresh','auth'],params.type)) {                      // check type of token is refresh or auth
        params.type='refresh';
    }
    var payload = {
        "iss": params.issuer,
        "exp": moment(expDate).unix(),
        "iat": moment(currDate).unix(),
        "sub": user.id,
        "type": params.type
    };

    var secret = params.secret;

    jwt.encode(secret, payload, function (err, token) {
        if (err) {
            cb(err);
        } else {
            cb(null,token);
        }
    });
};

/**
 * extracts token from web request
 */
exports.getToken = function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
};

/**
 * Returns secret key using issuer from token
 */
exports.secretCallback = function(req, payload, done){
    var issuer = payload.iss;

    if (issuer=='refresh') {
        tenent = dbConfig.parameters['token.refresh.secret'].value;
    } else if (issuer=='auth') {
        tenent = dbConfig.parameters['token.auth.secret'].value;
    } else {
        tenent = null;
    }
    
    data.getTenantByIdentifier(issuer, function(err, tenant){
        if (err) { return done(err); }
        if (!tenant) { return done(new Error('missing_secret')); }

        var secret = utilities.decrypt(tenant.secret);
        done(null, secret);
    });
};