var expressJwt = require('express-jwt');                       // https://www.npmjs.com/package/express-jwt
var ipfilter = require('express-ipfilter');             // https://www.npmjs.com/package/express-ipfilter

var routeHandler = module.exports = function routeHandler() {
};

routeHandler.prototype = {

    routes: function (app, dbConfig, bruteforce,stats,auditLog) {

        /**
         Load our route modules, pass dbConfig
         **/
        var unAuthRoute = require('../routes/un_auth')(dbConfig,stats,auditLog);
        var authRoute = require('../routes/auth')(dbConfig,auditLog);
        
        /*
        * Load any modules that need a object passed 
        */
        var token = require('../middlewares/token')(dbConfig,auditLog);

        /*
        * Ip filters
        */
        ipFilterBlackList = dbConfig.parameters['api.security.blacklist'].value.split(",");
        ipFilterWhiteList = dbConfig.parameters['api.security.whitelist'].value.split(",");
        
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
        app.post('/api/auth/v1/token', ipfilter(ipFilterBlackList, {log: false}), bruteforce.prevent, expressJwt({secret: dbConfig.parameters['token.refresh.secret'].value, isRevoked: token.isRevokedCallback}),authRoute.token);       // passed refresh token, gets auth token


        /*
         un-auth routes  - PRIVATE routes
         Have whitelist filter enabled
        *Require Authorization header with value as api key
        */
         app.post('/api/auth/v1/servicetoken', ipfilter(ipFilterWhiteList, {log: false}),unAuthRoute.serviceToken);       // passed an api key, returns a token for servers


        /**
         auth routes  - PRIVATE routes
         Have whitelist filter enabled
         Require a service token
         **/
        app.post('/api/auth/v1/validatetoken', ipfilter(ipFilterWhiteList, {
            mode: 'allow',
            log: false
        }), expressJwt({secret: dbConfig.parameters['token.service.secret'].value}),
            authRoute.validate);     // passed auth token in body param, returns 200 or 401

        app.post('/api/auth/v1/validateservicetoken', ipfilter(ipFilterWhiteList, {
                mode: 'allow',
                log: false
            }), expressJwt({secret: dbConfig.parameters['token.service.secret'].value}),
            authRoute.validateService);     // passed service token, returns 200 or 401
    }
};