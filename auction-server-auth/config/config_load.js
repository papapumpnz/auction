var config = require('../models/Config') ;
var async = require('async');



/**
 Exports configuration from the database
 applicationName : an applications name as defined in auction-server-auth/config/default.json
 callback : callback function (returns err, collection)
 **/

module.exports = {
    load: function(applicationName,callback) {
        var collection={"parameters":{}};
        collection.lastUpdate=new Date();
        var searchParam=['all'];
        if (applicationName) {
            searchParam.push(applicationName.toLowerCase());
        }

        config.find({consumer: { $in : searchParam}}, function (err, parameters) {
            if (err) {
                return callback(err);
            }
            async.each(parameters, function (param, cb) {
                //var a={};
                //a[param.name]={"value":param.value,"consumer":param.consumer,"description":param.description};
                collection.parameters[param.name]={"value":param.value,"consumer":param.consumer,"description":param.description};
                cb();
            }, function(err) {
                return callback(null,collection);
            });
        });
    }
};
