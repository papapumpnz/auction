var _ = require('underscore');
var express = require('express');
var compress = require('compression');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var path = require('path');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var dotenv = require('dotenv');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');
var ExpressBrute = require('express-brute');
var MongoStore = require('express-brute-mongo');        // https://www.npmjs.com/package/express-brute
var MongoClient = require('mongodb').MongoClient;
var ipfilter = require('express-ipfilter');             // https://www.npmjs.com/package/express-ipfilter
var config = require('config');
var getDbConfig = require('./config/config_load');
var jwt = require('express-jwt');                       // https://www.npmjs.com/package/express-jwt

/**
 Check we have database configuration details
 https://github.com/lorenwest/node-config/wiki/Configuration-Files
 **/
if (!config.database){
    console.log('Error loading file based configuration.');
    process.exit(1);
}

/**
  MongooseDb store for Brute
**/
var store = new MongoStore(function (ready) {
  MongoClient.connect(config.database.mongodb, function(err, db) {
    if (err) throw err;
    ready(db.collection('bruteforce-store'));
  });
});


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 *
 * Default path: .env (You can remove the path argument entirely, after renaming `.env.example` to `.env`)
 */
dotenv.load({ path: './config/.env.example' });

/**
 * API keys and Passport configuration.
 */
var passportConfig = require('./passport/passport');

/**
 * Create Express server.
 */
var app = express();

/**
 Load our routes
 **/

var unAuthRoute = require ('./routes/un-auth');
var authRoute = require ('./routes/auth');

/**
 * Connect to MongoDB.
 */
mongoose.connect(config.database.mongodb || config.database.mongodb_uri);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/**
 * Load our database config parameters on a regular interval
 */
appName=config.application.name;
var dbConfig;
var interval = 1 * 60 * 1000; // 1 minute
setInterval(function() {
    getDbConfig.load(appName, function (err,collection) {
        if (err) {
            console.log('Error loading database configuration. Error was : ' + err);
        }
        if (collection.parameters) {
            dbConfig = collection;
        }
    });
},interval);

/**
 * Ensure we load our db config before we start our app
 */
getDbConfig.load(appName, function (err, collection) {
    if (err) {
        console.log('Error loading database configuration. Error was : ' + err);
        process.exit(1);
    }
    if (collection.parameters) {
        dbConfig = collection;

        /**
         * Express configuration.
         */

        app.set('port', process.env.PORT || 3000);
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'jade');
        app.set('x-powered-by', false);
        app.use(compress());
        app.use(sass({
            src: path.join(__dirname, 'public'),
            dest: path.join(__dirname, 'public'),
            sourceMap: true
        }));
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(expressValidator());
        app.use(methodOverride());
        app.use(passport.initialize());


        app.all('/*', function (req, res, next) {
            // CORS headers
            res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            // Set custom headers for CORS
            res.header('Access-Control-Allow-Headers', 'Content-type,Accept,Authorization');
            if (req.method == 'OPTIONS') {
                res.status(200).end();
            } else {
                next();
            }
        });

        app.use(express.static(path.join(__dirname, 'public'), {maxAge: 31557600000}));

        /**
         *
         * Express brute config
         * https://www.npmjs.com/package/express-brute
         */
        var bruteforce = new ExpressBrute(store, {
            lifetime: dbConfig.parameters['api.security.ratelimit.requests'].value,
            freeRetries: dbConfig.parameters['api.security.ratelimit.lifetime.secs'].value
        });

        /**
         Routes
         **/

        /**
         un-auth routes - PUBLIC routes
         Have rate limiter enabled
         Have blacklist filter enabled
         **/
        ipFilterBlackList = dbConfig.parameters['api.security.blacklist'].value.split(",");
        app.get('/', ipfilter(ipFilterBlackList, {log:false}), bruteforce.prevent, unAuthRoute.index);
        app.get('/health', ipfilter(ipFilterBlackList, {log:false}), bruteforce.prevent, unAuthRoute.health);
        app.post('/api/v1/login', ipfilter(ipFilterBlackList, {log:false}), bruteforce.prevent, unAuthRoute.login);           // passed account, gets refresh token
        app.post('/api/v1/register', ipfilter(ipFilterBlackList, {log:false}), bruteforce.prevent, unAuthRoute.register);

        /**
         un-auth routes - PUBLIC routes
         Have rate limiter enabled
         Require token
         **/
        app.post('/api/v1/token', bruteforce.prevent, unAuthRoute.token);       // passed refresh token, gets auth token

        /**
         auth routes  - PRIVATE routes
         Have whitelist filter enabled
         Require token
         **/
        ipFilterWhiteList = dbConfig.parameters['api.security.whitelist'].value.split(",");
        app.post('/api/v1/validate_token', ipfilter(ipFilterWhiteList, {mode: 'allow',log:false}), authRoute.validate);     // passed auth token, returns 200 or 401


        /**
         Fall through routes for 404's and 500's
         **/
        app.use(function (req, res) {
            res.status(404);
            res.json({
                "status": 404,
                "message": "route not found"
            });
        });

        // Middleware error handler for json response
        function handleError(err, req, res, next) {
            var output = {
                error: {
                    name: err.name,
                    message: err.message,
                    text: err.toString()
                }
            };
            var statusCode = err.status || 500;
            res.status(statusCode).json(output);
        }

        /**
         * Error Handler.
         */
        // error handling middleware last
        app.use([handleError]);

        /**
         * Start Express server.
         */
        app.listen(app.get('port'), function () {
            console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
            console.log('Node version ' + process.version)
        });

        module.exports = app;
        exports.dbConfig = function() {
            return dbConfig;
        }
    } else {
        console.log('Failed to load any database configuration. Existing application.');
        process.exit(1);
    }
});