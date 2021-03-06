var _ = require('underscore');
var express = require('express');
var forceSSL = require('express-force-ssl');                // https://www.npmjs.com/package/express-force-ssl
var compress = require('compression');
var bodyParser = require('body-parser');
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
var config = require('config');                         // default json file config loader
var pageHandler = require('./routes/route_handler');
var statware = require("statware");                     // https://www.npmjs.com/package/statware
var winston = require('winston');                       // https://github.com/winstonjs/winston
var expressWinston = require('express-winston');       // https://github.com/bithavoc/express-winston
var mongoDbWinston = require('winston-mongodb').MongoDB;    //https://www.npmjs.com/package/winston-mongodb
var fs = require('fs');
var http = require('http');
var https = require('https');

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
  MongoClient.connect(config.database.mongodb_auth, function(err, db) {
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
 * Connect to MongoDB.
 */
mongoose.connect(config.database.mongodb_auth);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error to auth database. Please make sure that MongoDB is running.');
  process.exit(1);
});


/*
* Create our stats object
*/
var stats = statware();
if (process.env.NODE_ENV==='development') {
    stats.installProcessInfo();
    stats.installSystemInfo();
}

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 80);
app.set('ssl_port', process.env.SSL_PORT || 443);
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
app.use(forceSSL);
app.all('/*', function (req, res, next) {
    // stats
    stats.increment("totalRequests");
    next();
});

app.all('/*', function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,Authorization,X-API-KEY');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.use(express.static(path.join(__dirname, 'public'), {maxAge: 31557600000}));

/*
*  Winston expressWinston express logger
*/
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json:false,
            colorize: true
        }),
        new winston.transports.File({
            filename: config.logs.http,
            maxFiles : config.logs.max,
            maxsize : config.logs.size
        })
    ],
    meta: false,
    msg: "HTTP {{req.method}} {{req.url}} {{req.statusCode}} {{res.responseTime}}ms",
    expressFormat:true
}));

/*
 *  Winston mongoDb user audit logger
 */
var auditLog = new (winston.Logger) ({
    transports:[
        new winston.transports.MongoDB({
            db: config.database.mongodb_audit,
            collection: 'audit'
        })
    ]
});

/*
 *  Winston console, file logger for console out
 */
var logger = new (winston.Logger) ({
    transports: [
        new winston.transports.File({
            filename: config.logs.system,
            handleExceptions: true,
            exitOnError: false,
            maxFiles: config.logs.max,
            maxsize: config.logs.size,
            humanReadableUnhandledException: true
        }),
        new winston.transports.Console({
            handleExceptions: true,
            exitOnError: false,
            colorize: true
        })
    ]
});


/**
 *
 * Express brute config
 * https://www.npmjs.com/package/express-brute
 */
var bruteforce = new ExpressBrute(store, {
    lifetime: config.security.ratelimit_requests,
    freeRetries: config.security.ratelimit_lifetime_secs
});

/**
 * Get our routes, pass objects
 */
var ph = new pageHandler();
ph.routes(app,bruteforce,stats,auditLog,logger);


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

var ssl_options = {
    key: fs.readFileSync(config.ssl.private_key),
    cert: fs.readFileSync(config.ssl.cert)
    //ca: fs.readFileSync(config.ssl.ca)
};

var server = http.createServer(app);
var secureServer = https.createServer(ssl_options, app);

logger.info('%s server startup ',config.application.name);
secureServer.listen(app.get('ssl_port'), function () {
    logger.info('Express secure server listening on port %d in %s mode', app.get('ssl_port'), app.get('env'));

});
server.listen(app.get('port'), function () {
    logger.info('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));

});
logger.info('Node version ' + process.version)


module.exports = app;