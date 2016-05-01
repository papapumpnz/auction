/**
 * Module dependencies.
 */
 var dotenv = require('dotenv');
var mongoose = require('mongoose');
var User = require('../models/User');


/**

 * Default path: .env (You can remove the path argument entirely, after renaming `.env.example` to `.env`)
 */
dotenv.load({ path: './.env.example' });
var adminFile = require('./admin_accounts.json');

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
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

  User.findOne({ email: user.email }, function(err, existingUser) {
    if (existingUser) {
      console.log('Admin account ' + admin.email + ' already exists');
      return
    }
    user.save(function(err) {
      if (err) {
        console.log('An error occured ' + err);
      }
      console.log('Done')
      return
    });
  });
});

console.log('Finished!')

