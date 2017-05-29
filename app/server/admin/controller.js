'use strict';

const db = require('@db');
const config = require('@config');
const configs = require('@helpers/configs');
const themes = require('@helpers/themes');
const Flash = require('@helpers/flash');
const { countries, currencies } = require('country-data');
const Currency = require('@helpers/currency');

// Controllers
const UserController = require('@server/users/controller');
const SettingsController = require('@server/settings/controller');

const Admin = {};

Admin.hasDatabaseConnection = () => (db.connection.readyState !== 1 || !config.db.url);

Admin.createInstallation = async function (site) {
  try {
    if (site.password_repeat !== site.password) {
      throw new Flash({
        message: Flash.FLASH_MESSAGES.PASSWORDS_DOESNT_MATCH,
        name: 'password_repeat',
        type: Flash.FLASH_TYPES.ALERT_INPUT
      });
    }

    const currency = currencies[site.currency_code];

    // Create the user
    const admin = await UserController.create({
      email: site.email,
      username: site.username,
      password: site.password,
      role: 'administrator'
    });

    const settings = await SettingsController.create({
      name: site.name,
      description: site.description,
      theme: site.theme,
      home_url: site.home_url,
      store_country: site.store_country,
      currency_code: site.currency_code,
      currency_symbol: currency.symbol,
      ship_weight: site.ship_weight,
      ship_dimension: site.ship_dimension
    });

    Currency.setConfig({
      currency: {
        symbol: currency.symbol,
        precision: currency.decimals
      },
      number: {
        precision: currency.decimals
      }
    });

    return { admin, settings };

  } catch (e) {
    return Promise.reject(e);
  }
};

Admin.authenticate = async function (username, password) {
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