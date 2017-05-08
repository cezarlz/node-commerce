'use strict';

const db = require('../db');
const boss = require('boss-validator');
const configs = require('../helpers/configs');
const themes = require('../helpers/themes');

// Models
const User = require('../models/User');

module.exports = {
  renderHome: function (req, res) {
    res.render('nc-admin/index');
  },
  renderInstall: async function (req, res) {
    if (db.connection.readyState !== 1 || !process.env.NC_MONGO_CONNECT_URL) {
      res.render('nc-admin/install-error');
    }

    res.render('nc-admin/install', {
      configs: configs.getConfigs(),
      themes: await themes.getThemes()
    });
  },
  checkInstallation: function (req, res, next) {
    const c = configs.getConfigs();

    if (c.site_title && c.site_description && c.theme) {
      return res.redirect('/nc-admin/login');
    }

    next();
  },
  doInstall: async function (req, res) {
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
        login: data.source.user_login,
        password: data.source.user_password
      });

      admin.save(err => {
        if (err) throw err; 

        configs
          .addValue('site_title', data.source.site_title)
          .addValue('site_description', data.source.site_description)
          .addValue('theme', data.source.theme);

          return res.redirect('/nc-admin/login');
      });
    } catch (e) {
      const c = configs.getConfigs();
      
      res.render(`nc-admin/install`, {
        form_errors: e,
        configs: c,
        themes: await themes.getThemes()
      });
    }
  },
  renderLogin: function (req, res) {
    return res.render(`nc-admin/login`);
  },
  doLogin: async function (req, res) {
    try {
      var data = await boss.validate(req.body, {
        username: { required: true },
        password: {
          required: true,
          minlength: 6
        }
      });

      const { username, password } = data.source;

      const user = await User.getAuthenticated(username, password);

      console.log(user);

      return res.redirect(`/nc-admin/dashboard`);
      
    } catch (reject) {
      let errors = [];

      if (reject.err) {
        errors.push({
          message: 'It was not possible to login. Please try again',
          name: 'username'
        });
      }

      if (reject.reason) {
        const reasons = User.failedLogin;

        switch (reject.reason) {
          case reasons.NOT_FOUND:
          case reasons.PASSWORD_INCORRENT:
            errors.push({
              message: 'Invalid username or password. Please try again.',
              name: 'username'
            });
            break;
          
          case reasons.MAX_ATTEMPTS:
            errors.push({
              message: 'You tried to login 5 times. Please try again in 2 hours.',
              name: 'username'
            });
            break;
        }
      }

      res.render(`nc-admin/login`, {
        form_errors: errors
      });
    }
  }
}