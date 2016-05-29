var expressJwt = require('express-jwt');                       // https://www.npmjs.com/package/express-jwt
var ipfilter = require('express-ipfilter');             // https://www.npmjs.com/package/express-ipfilter
var config = require('config');

// TODO : freshed dbConfig object not being passed to required modules. Fix this.
    

var routeHandler = module.exports = function routeHandler() {
};

routeHandler.prototype = {
    
    routes: function (app,bruteforce,stats,auditLog,logger) {
        //dbConfig=this.dbConfig;
        /**
         Load our route modules, pass dbConfig
         **/
        var unAuthRoute = require('../routes/un_auth')(stats,auditLog,logger);
        var authRoute = require('../routes/auth')(auditLog,logger);
        
        /*
        * Load any modules that need a object passed 
        */
        var token = require('../middlewares/token')(auditLog,logger);

        /*
        * Ip filters
        */
        ipFilterBlackList = config.security.api_security_blacklist;
        ipFilterWhiteList = config.security.api_security_whitelist;
        
        /**
         Routes
         **/
        
        /**
         un-auth routes - PUBLIC routes
         Have rate limiter enabled
         Have blacklist filter enabled
         **/
        app.get('/api/auth/v1', ipfilter(ipFilterBlackList, {log: false}), bruteforce.prevent, unAuthRoute.index);
        app.get('/api/auth/v1/health', ipfilter(ipFilterBlackList, {log: false}), bruteforce.prevent, unAuthRoute.health);
        app.post('/api/auth/v1/login', ipfilter(ipFilterBlackList, {log: false}), bruteforce.prevent, unAuthRoute.login);           // passed account, gets refresh token
        app.post('/api/auth/v1/register', ipfilter(ipFilterBlackList, {log: false}), bruteforce.prevent, unAuthRoute.register);


        /**
         auth routes - PUBLIC routes
         Have rate limiter enabled
         Have blacklist filter enabled
         Require refresh token
         **/
        app.post('/api/auth/v1/token', ipfilter(ipFilterBlackList, {log: false}), bruteforce.prevent, expressJwt({secret: config.tokens.refresh.secret, isRevoked: token.isRevokedCallback}),authRoute.token);       // passed refresh token, gets auth token


        /*
         un-auth routes  - PRIVATE routes
         Have whitelist filter enabled
        *Require Authorization header with value as api key
        */
         app.post('/api/auth/v1/servicetoken', ipfilter(ipFilterWhiteList, {log: false, mode: 'allow'}),unAuthRoute.serviceToken);       // passed an api key, returns a token for servers


        /**
         auth routes  - PRIVATE routes
         Have whitelist filter enabled
         Require a service token
         **/
        app.post('/api/auth/v1/validatetoken', ipfilter(ipFilterWhiteList, {
            mode: 'allow',
            log: false
        }), expressJwt({secret: config.tokens.service.secret}),
            authRoute.validate);     // passed auth token in body param, returns 200 or 401

        app.post('/api/auth/v1/validateservicetoken', ipfilter(ipFilterWhiteList, {
                mode: 'allow',
                log: false
            }), expressJwt({secret: config.tokens.service.secret}),
            authRoute.validateService);     // passed service token, returns 200 or 401
    }
};