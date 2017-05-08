'use strict';

const db = require('../db');
const { Schema } = db;
const bcrypt = require('bcrypt-nodejs');

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;

const userSchema = new Schema({
  first_name: String,
  last_name: String,
  display_name: String,
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true
  },
  username: { 
    type: String, 
    required: true,
    unique: true
  },
  password: { 
    type: String, 
    required: true
  },
  avatar_url: String,
  role: {
    type: String,
    required: true,
    default: 'administrator',
    enum: ['administrator',  'seller', 'customer']
  },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number }
});

userSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

userSchema.method('isValidPassword', function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return cb(err);

    return isMatch;
  });
});

userSchema.method('incLoginAttempts', function (cb) {
  // if we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
      return this.update({
          $set: { loginAttempts: 1 },
          $unset: { lockUntil: 1 }
      }, cb);
  }

  // otherwise we're incrementing
  var updates = { $inc: { loginAttempts: 1 } };
  
  // lock the account if we've reached max attempts and it's not locked already
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
      updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }
  return this.update(updates, cb);
});

userSchema.virtual('isLocked').get(function() {
  // check for a future lockUntil timestamp
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

const reasons = userSchema.statics.failedLogin = {
    NOT_FOUND: 'NOT_FOUND',
    PASSWORD_INCORRECT: 'PASSWORD_INCORRECT',
    MAX_ATTEMPTS: 'MAX_ATTEMPTS',
    ERROR: 'ERROR'
};

userSchema.statics.getAuthenticated = function (username, password) {
    return new Promise((resolve, reject) => {
      this.findOne({ username }, function(err, user) {
        if (err) return reject({
          err,
          user: null
        });

        // make sure the user exists
        if (!user) {
            return reject({
              err: null,
              user: null,
              reason: reasons.NOT_FOUND
            });
        }

        // check if the account is currently locked
        if (user.isLocked) {
            // just increment login attempts if account is already locked
            return user.incLoginAttempts(function(err) {
                if (err) return reject({ err });

                return reject({
                  err: null,
                  user: null,
                  reason: reasons.MAX_ATTEMPTS
                });
            });
        }

        // test for a matching password
        user.isValidPassword(password, function(err, isMatch) {
            console.log(err, isMatch);
            
            if (err) return reject({ err });

            // check if the password was a match
            if (isMatch) {
                // if there's no lock or failed attempts, just return the user
                if (!user.loginAttempts && !user.lockUntil) return resolve(user);
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function(err) {
                    if (err) return reject({ err });

                    return resolve(user);
                });
            }

            // password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(function(err) {
                if (err) return reject({ err });

                return reject({
                  err: null,
                  user: null,
                  reason: reasons.PASSWORD_INCORRECT
                });
            });
        });
      });
    });
};

const User = db.model('User', userSchema);

module.exports = User;