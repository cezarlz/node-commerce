'use strict';

const UserModel = require('./model');

const User = function (user = null) {
  this.user = user;
};

User.prototype.create = async function (data = {}) {
  this.user = Object.assign({}, this.user, data);

  try {
    const user = new UserModel(this.user);

    await user.save();

    this.user = user;

    return user;
  }
  catch (e) {
    console.log('user create error');
    console.log('%j', e);

    return Promise.reject(e);
  }
};

User.getUser = function (username, password, done) {
  return UserModel.getAuthenticated(
    username,
    password,
    function (err, user, reason) {
      if (err) return done(err);

      if (user) return done(null, user);

      const reasons = UserModel.failedLogin;

      switch (reason) {
        case reasons.NOT_FOUND:
        case reasons.PASSWORD_INCORRECT:
          return done(null, false);
        case reasons.MAX_ATTEMPTS:
          return done(null, false, { message: 'You tried to login 5 times. Please, try again until 2 hours.' });
      }
    }
  );
};

module.exports = User;