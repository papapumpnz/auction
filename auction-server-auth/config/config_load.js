var async = require('async');
var mongoose = require('mongoose');
var config = require('config');
var result={};

/*
*  DEPRECIATED   -- DO NOT USE --
* 
* 
* 
*/


// http://www.zertz.ca/handling-multiple-databases-and-connections-with-mongoose/

/**
 * Connect to MongoDB.
 */
mongoConfig = mongoose.createConnection(config.database.mongodb_config);
mongoConfig.on('error', function() {
    console.log('MongoDB Connection Error to config database. Please make sure that MongoDB is running.');
    process.exit(1);
});

var configSchema = new mongoose.Schema({
    name: { type: String, lowercase: true, index : {unique: true}, required: true },
    value : { type : String},
    consumer: { type : Array, lowercase: true, default : ["all"], index: true},
    description: { type : String}

}, { timestamps: true});


var configDb = mongoConfig.model('Config', configSchema);

/**
 Exports configuration from the database
 applicationName : an applications name as defined in auction-server-auth/config/default.json
 callback : callback function (returns err, collection)
 **/

module.exports = {

    /*
     *  Load db config on an interval
     */
    loadOnInterval: function (applicationName, refreshInterval) {
        var interval = refreshInterval * 60 * 1000;

        (function loadDb() {
            this.load(appName, function (err, collection) {
                if (err) {
                    console.log('Error loading database configuration. Error was : ' + err);
                }
                if (collection.parameters) {
                    this.result = collection;
                }
            });
            setTimeout(loadDb,interval);
        })();
    },

    load: function(applicationName) {
        var collection={"parameters":{}};
        collection.lastUpdate=new Date();
        var searchParam=['all'];
        if (applicationName) {
            searchParam.push(applicationName.toLowerCase());
        }

        configDb.find({consumer: { $in : searchParam}}, function (err, parameters) {
            if (err) {
                return callback(err);
            }
            async.each(parameters, function (param, cb) {
                //var a={};
                //a[param.name]={"value":param.value,"consumer":param.consumer,"description":param.description};
                collection.parameters[param.name]={"value":param.value,"consumer":param.consumer,"description":param.description};
                cb();
            }, function(err) {
                this.result = collection;
            });
        });
    }
};

module.exports = exports = this.result;