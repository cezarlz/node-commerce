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

const renderLogin = async function (req, res) {
  const status = req.query.status;

  if (req.session.user) {
    return res.redirect('/admin/dashboard');
  }

  const flash = new Flash();

  if (status) {
    switch (status) {
      case '400':
        flash.create({
          message: Flash.FLASH_MESSAGES.INVALID_USERNAME_PASSWORD,
          target: '.form-login',
          type: Flash.FLASH_TYPES.ALERT_ERROR
        });
        break;
      case '401':
        flash.create({
          message: Flash.FLASH_MESSAGES.NOT_AUTHORIZED,
          target: '.form-login',
          type: Flash.FLASH_TYPES.ALERT_ERROR
        });
        break;
      case '429':
        flash.create({
          message: Flash.FLASH_MESSAGES.MAX_LOGIN_ATTEMPT,
          target: '.form-login',
          type: Flash.FLASH_TYPES.ALERT_WARNING
        });
        break;
      case 'logout':
        flash.create({
          message: Flash.FLASH_MESSAGES.LOGOUT,
          target: '.form-login',
          type: Flash.FLASH_TYPES.ALERT_INFO
        });
        break;
      default:
        flash.create({
          message: Flash.FLASH_MESSAGES.GENERAL,
          target: '.form-login',
          type: Flash.FLASH_TYPES.ALERT_ERROR
        });
        break;
    }
  }

  res.locals.flash = flash.list();

  return res.render(`admin/login`);
};

const renderDashboardIndex = function (req, res) {
  return res.render(`admin/dashboard/index`);
};

const doLogout = async function (req, res) {
  // Destroy session
  await req.session.destroy();

  return res.redirect('/admin/login?status=logout');
};

const doInstall = async function (req, res) {

};

const doLogin = async function (req, res) {
  let errors = [];
  let status;

  try {
    const data = await boss.validate(req.body, {
      username: { required: true },
      password: {
        required: true,
        minlength: 6
      }
    });

    const { username, password } = data.source;

    const user = await UserController.findByCredentials(username, password);

    // Create the user session
    req.session.user = {
      name: user.display_name,
      email: user.email,
      avatar: user.avatar_url,
      role: user.role
    };

    return res.redirect(`/admin/dashboard`);

  } catch (reject) {
    if (reject.err) {
      status = '500';
    }

    if (reject.reason >= 0) {
      const reasons = User.failedLogin;

      switch (reject.reason) {
        case reasons.NOT_FOUND:
        case reasons.PASSWORD_INCORRECT:
          status = '400';
          break;

        case reasons.MAX_ATTEMPTS:
          status = '429';
          break;
      }
    }

    return res.redirect(`/admin/login?status=${status}`);
  }
};

module.exports = Admin;