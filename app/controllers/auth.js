'use strict';

const User = require('../models/User');

const getUser = function (username, password, done) {
  return User.getAuthenticated(
    username, 
    password, 
    function (err, user, reason) {
      if (err) return done(err);

      if (user) return done(null, user);

      const reasons = User.failedLogin;

      switch (reason) {
        case reasons.NOT_FOUND:
        case reasons.PASSWORD_INCORRECT:
          return done(null, false);
        case reasons.MAX_ATTEMPTS:
          return done(null, false, { message: 'Your tried to login 5 times. Please, try again until 2 hours.' });
      }
    }
  );
};

module.exports = { getUser };