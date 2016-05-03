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
var MongoStore = require('express-brute-mongo');
var MongoClient = require('mongodb').MongoClient;
var ipfilter = require('express-ipfilter')


/**
  MongooseDb store for Brute
**/
var store = new MongoStore(function (ready) {
  MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
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
privateAPIWhiteList=_.toArray(process.env.PRIVATE_API_WHITELIST.slice());
/**
 * API keys and Passport configuration.
 */
var passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
var app = express();

/**
 Load our routes
 **/
 
// https://www.npmjs.com/package/express-brute
var bruteforce = new ExpressBrute(store, {
    lifetime : process.env.RATE_LIMIT_LIFETIME_SECS,
    freeRetries : process.env.RATE_LIMIT_RETRIES
});

var unAuthRoute = require ('./routes/un-auth');
var authRoute = require ('./routes/auth');

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(passport.initialize());
 
 
app.all('/*', function(req, res, next) {
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

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
     Routes
**/

/**
  un-auth routes - PUBLIC routes
  Have rate limiter enabled
**/
app.get('/', bruteforce.prevent, unAuthRoute.index);
app.get('/health', bruteforce.prevent, unAuthRoute.health);
app.post('/api/v1/login', bruteforce.prevent, unAuthRoute.login);
app.post('/api/v1/register', bruteforce.prevent, unAuthRoute.register);

/**
  un-auth routes - PUBLIC routes
  Have rate limiter enabled
  Require token
**/
app.post('/api/v1/token', bruteforce.prevent, passport.authenticate('jwt', { session: false, failWithError: true}), unAuthRoute.token);

/**
  auth routes  - PRIVATE routes
  Have whitelist filter enabled
  Require token
**/
console.log(privateAPIWhiteList);
app.use(ipfilter(privateAPIWhiteList, {mode:'allow'}));
app.post('/api/v1/validate_token',passport.authenticate('jwt', { session: false, failWithError: true}), authRoute.validate);


/**
  Fall through routes for 404's and 500's
**/
app.use(function(req, res) {
  res.status(404);
  res.json({
    "status": 404,
    "message": "route not found"
  });
});

// Middleware error handler for json response
function handleError(err,req,res,next){
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
app.use( [handleError] );

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
  console.log('Node version ' + process.version)
});

module.exports = app;