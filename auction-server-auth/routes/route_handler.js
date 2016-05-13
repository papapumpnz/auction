var expressJwt = require('express-jwt');                       // https://www.npmjs.com/package/express-jwt
var ipfilter = require('express-ipfilter');             // https://www.npmjs.com/package/express-ipfilter

var routeHandler = module.exports = function routeHandler() {
};

routeHandler.prototype = {

    routes: function (app, dbConfig, bruteforce) {

        /**
         Load our route modules, pass dbConfig
         **/
        var unAuthRoute = require('../routes/un_auth')(dbConfig);
        var authRoute = require('../routes/auth')(dbConfig);
        
        /*
        * Load any modules that need a object passed 
        */
        var token = require('../middlewares/token')(dbConfig);

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

        app.get('/', ipfilter(ipFilterBlackList, {log: false}), bruteforce.prevent, unAuthRoute.index);
        app.get('/health', ipfilter(ipFilterBlackList, {log: false}), bruteforce.prevent, unAuthRoute.health);
        app.post('/api/v1/login', ipfilter(ipFilterBlackList, {log: false}), bruteforce.prevent, unAuthRoute.login);           // passed account, gets refresh token
        app.post('/api/v1/register', ipfilter(ipFilterBlackList, {log: false}), bruteforce.prevent, unAuthRoute.register);

        /**
         un-auth routes - PUBLIC routes
         Have rate limiter enabled
         Have blacklist filter enabled
         Require token
         **/
        app.post('/api/v1/token', ipfilter(ipFilterBlackList, {log: false}), bruteforce.prevent, expressJwt({secret: token.secretCallback, isRevoked: token.isRevokedCallback}),unAuthRoute.token);       // passed refresh token, gets auth token


        /**
         auth routes  - PRIVATE routes
         Have whitelist filter enabled
         Require an API key
         Pass auth token
         **/
        app.post('/api/v1/validate_token', ipfilter(ipFilterWhiteList, {
            mode: 'allow',
            log: false
        }), authRoute.validate);     // passed auth token, returns 200 or 401
    }
};