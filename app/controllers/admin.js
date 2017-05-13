'use strict';

const db = require('@db');
const boss = require('boss-validator');
const configs = require('@helpers/configs');
const themes = require('@helpers/themes');
const Flash = require('@helpers/flash');

// Models
const User = require('../models/User');

// Controllers
const renderHome = function (req, res) {
  return res.redirect('/admin/login');
};

const renderInstall = async function (req, res) {
  if (db.connection.readyState !== 1 || !process.env.NC_MONGO_CONNECT_URL) {
    return res.render('admin/install-error');
  }

  return res.render('admin/install', {
    configs: configs.getConfigs(),
    themes: await themes.getThemes()
  });
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
  try {
    var data = await boss.validate(req.body, {
      site_title: { required: true },

      site_description: { required: true, maxlength: 160 },

      user_login: { required: true },
      user_password: { required: true, minlength: 10 },
      user_password_repeat: { required: true, minlength: 10 },
      user_email: { required: true, email: true },
      theme: { required: true }
    });

    if (data.source.user_password_repeat !== data.source.user_password) {
      throw [{
        message: 'The passwords are wrong. Did you type correctly?',
        name: 'user_password_repeat'
      }];
    }

    // Create the user
    const admin = new User({
      email: data.source.user_email,
      username: data.source.user_login,
      password: data.source.user_password
    });

    await admin.save();

    configs
      .addValue('site_title', data.source.site_title)
      .addValue('site_description', data.source.site_description)
      .addValue('theme', data.source.theme);

    return res.redirect('/admin/login');

  } catch (e) {
    const c = configs.getConfigs();

    res.locals.flash = e;

    return res.render(`admin/install`, {
      configs: c,
      themes: await themes.getThemes()
    });
  }
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

    const user = await User.findByCredentials(username, password);

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

const checkInstallation = function (req, res, next) {
  const c = configs.getConfigs();

  if (c.site_title && c.site_description && c.theme) {
    return res.redirect('/admin/login');
  }

  next();
};

module.exports = {
  renderHome,
  renderInstall,
  renderLogin,
  renderDashboardIndex,
  checkInstallation,
  doInstall,
  doLogin,
  doLogout
};