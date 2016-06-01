var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');
var moment = require('moment')

/*
* Date mask for returning mongodb dates
* 09:27am 26-03-2016
*/
var dateMask = 'hh:mma DD-MM-YYYY';

var userSchema = new mongoose.Schema({
  email: { type: String, lowercase: true, unique: true, index: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  isAdmin: Boolean,
  
  refreshToken: String,
  accountActive: {type: Boolean, default: true},
  lastIp : String,

  facebook: String,
  twitter: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  steam: String,
  tokens: Array,
  
  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  }

}, { timestamps: true, toObject:{ virtuals:true}, toJSON: {virtuals:true}});

/*
* Moongoose virtual for dateMask
*/
userSchema
   .virtual('createdAt_dateformated')
   .get(function () {
      return moment(this.createdAt).format(dateMask);
   });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};


var User = mongoose.model('User', userSchema);

module.exports = User;
