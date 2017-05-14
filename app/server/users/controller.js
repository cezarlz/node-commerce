'use strict';

const Flash = require('@helpers/flash');

const UserModel = require('./model');

const User = function (user = null) {
  this.user = user;
};

User.prototype.create = async function (data = {}) {
  try {
    const user = new UserModel(Object.assign({}, this.user, data));

    await user.validate();

    await user.save();

    this.user = user;

    return user;
  }
  catch (e) {
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
          return done(null, false, { message: Flash.FLASH_MESSAGES.MAX_LOGIN_ATTEMPT });
      }
    }
  );
};

module.exports = User;