'use strict';

const Flash = require('@helpers/flash');

const UserModel = require('./model');

const User = {};

User.create = async function (data = {}) {
  try {
    const user = new UserModel(data);

    await user.validate();

    await user.save();

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

      const reasons = User.FAILED_LOGIN;

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

User.findByCredentials = async function (username, password) {
  try {
    return await UserModel.findByCredentials(username, password);
  }
  catch (e) {
    return Promise.reject(e);
  }
};

User.FAILED_LOGIN = UserModel.failedLogin;

module.exports = User;