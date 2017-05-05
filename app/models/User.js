'use strict';

const db = require('../db');
const { Schema } = db;
const bcrypt = require('bcrypt-nodejs');

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
  login: { 
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
  }
});

userSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);

      user.password = hash;

      next();
    });
  });
});

const User = db.model('User', userSchema);

module.exports = User;