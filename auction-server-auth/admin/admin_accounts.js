/**
 * Module dependencies.
 */
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var User = require('../models/User');
var config = require('config');


/**

 * Default path: .env (You can remove the path argument entirely, after renaming `.env.example` to `.env`)
 */
dotenv.load({ path: './.env.example' });
var adminFile = require('./admin_accounts.json');

/**
 * Connect to MongoDB.
 */
mongoose.connect(config.database.mongodb || config.database.mongodb_uri);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/**
 * Drop the existing users database
 */
mongoose.connection.collections['users'].drop( function(err) {
  console.log('Users collection dropped');
});

/*
* Add admin accounts
*/
var admins=adminFile.admins;
admins.forEach (function (admin) {
  console.log('Processing admin account ' + admin.email);
  
  var user = new User({
    email: admin.email,
    password: admin.default_pass,
    isAdmin : 'true'
  });

  user.save(function(err) {
    if (err) {
      console.log('An error occured ' + err);
    }
    return
  });
});

console.log('Finished!')

