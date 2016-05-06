/**
 * Module dependencies.
 */
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var Config = require('../models/Config');
var config = require('config');


/**

 * Load in our data
 */
var parametersFile = require('./parameters.json');

/**
 * Connect to MongoDB.
 */
mongoose.connect(config.database.mongodb || config.database.mongodb_uri);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/*
* Add params
*/
var params=parametersFile.parameters;
params.forEach (function (param) {
  console.log('Processing param  ' + param.name);
  
  var parameter = new Config({
    name: param.name,
    value: param.value
  });

  Config.findOne({ name: parameter.name }, function(err, existingParameter) {
    if (existingParameter) {
      // delete the existing parameter
    }
    parameter.save(function(err) {
      if (err) {
        console.log('An error occured ' + err);
      }
      console.log('Done')
      return
    });
  });
});

console.log('Finished!')

