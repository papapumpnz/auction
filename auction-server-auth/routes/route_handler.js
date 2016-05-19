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
        

        //TODO : use api key for server to service communication
        
        /**
         auth routes  - PRIVATE routes
         Have whitelist filter enabled
         Require an API key
         Pass auth token
         **/
        app.post('/api/auth/v1/token', ipfilter(ipFilterBlackList, {log: false}), bruteforce.prevent, expressJwt({secret: dbConfig.parameters['token.refresh.secret'].value, isRevoked: token.isRevokedCallback}),authRoute.token);       // passed refresh token, gets auth token

        app.post('/api/auth/v1/validatetoken', ipfilter(ipFilterWhiteList, {
            mode: 'allow',
            log: false
        }), expressJwt({secret: dbConfig.parameters['token.auth.secret'].value}),
            authRoute.validate);     // passed auth token, returns 200 or 401
    }
};