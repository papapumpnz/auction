var expressJwt = require('express-jwt');                       // https://www.npmjs.com/package/express-jwt
var ipfilter = require('express-ipfilter');             // https://www.npmjs.com/package/express-ipfilter
var config = require('config');

var routeHandler = module.exports = function routeHandler() {
};

routeHandler.prototype = {
    
    routes: function (app,bruteforce,stats,auditLog,logger) {
        //dbConfig=this.dbConfig;
        /**
         Load our route modules, pass dbConfig
         **/
        //var unAuthRoute = require('../routes/un_auth')(stats,auditLog,logger);
        //var authRoute = require('../routes/auth')(auditLog,logger);
        
        /*
        * Load any modules that need a object passed 
        */


        /*
        * Ip filters
        */
        ipFilterBlackList = config.security.api_security_blacklist;
        ipFilterWhiteList = config.security.api_security_whitelist;
        

    }
};