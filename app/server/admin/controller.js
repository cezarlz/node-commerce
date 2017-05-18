'use strict';

const db = require('@db');
const boss = require('boss-validator');
const config = require('@config');
const configs = require('@helpers/configs');
const themes = require('@helpers/themes');
const Flash = require('@helpers/flash');

// Controllers
const UserController = require('@server/users/controller');
const SettingsController = require('@server/settings/controller');

const Admin = function () { };

Admin.prototype.hasDatabaseConnection = () => (db.connection.readyState !== 1 || !config.db.url);

Admin.prototype.createInstallation = async function (site) {
  try {
    var data = await boss.validate(site, {
      site_title: { required: true },
      site_description: { required: true, maxlength: 160 },
      user_login: { required: true },
      user_password: { required: true, minlength: 10 },
      user_password_repeat: { required: true, minlength: 10 },
      user_email: { required: true, email: true },
      theme: { required: true }
    });

    if (data.source.user_password_repeat !== data.source.user_password) {
      throw new Flash({
        message: Flash.FLASH_MESSAGES.PASSWORDS_DOESNT_MATCH,
        name: 'user_password_repeat',
        type: Flash.FLASH_TYPES.ALERT_INPUT
      });
    }

    // Create the user
    const admin = new UserController({
      email: data.source.user_email,
      username: data.source.user_login,
      password: data.source.user_password,
      role: 'administrator'
    });

    const settings = new SettingsController({
      site_name: data.source.site_title,
      site_description: data.source.site_description,
      site_theme: data.source.theme
    });

    await Promise.all([admin.create(), settings.create()]);

    return { admin, settings };

  } catch (e) {
    return Promise.reject(e);
  }
};

Admin.prototype.authenticate = async function (username, password) {
  try {
    const data = await boss.validate({ username, password }, {
      username: { required: true },
      password: {
        required: true,
        minlength: 10
      }
    });

    const user = await UserController.findByCredentials(username, password);

    return {
      name: user.display_name,
      email: user.email,
      avatar: user.avatar_url,
      role: user.role
    };
  }
  catch (e) {
    let error = e;

    if (e.reason >= 0) {
      switch (e.reason) {
        case UserController.FAILED_LOGIN.NOT_FOUND:
        case UserController.FAILED_LOGIN.PASSWORD_INCORRECT:
          error = {
            message: Flash.FLASH_MESSAGES.INVALID_USERNAME_PASSWORD
          };
          break;

        case UserController.FAILED_LOGIN.MAX_ATTEMPTS:
          error = {
            message: Flash.FLASH_MESSAGES.MAX_LOGIN_ATTEMPT,
            type: Flash.FLASH_TYPES.ALERT_WARNING
          };
          break;

        case UserController.FAILED_LOGIN.GENERAL_ERROR:
          error = {
            message: Flash.FLASH_MESSAGES.GENERAL
          };
          break;
      }
    }

    return Promise.reject(new Flash(error));
  }
};

module.exports = Admin;