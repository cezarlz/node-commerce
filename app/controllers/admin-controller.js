const db = require('../db');
const boss = require('boss-validator');
const packageHelpers = require('../helpers/package-helpers');
const themesHelpers = require('../helpers/themes-helpers');

module.exports = {
  home: function (req, res) {
    res.render('nc-admin/index');
  },
  install: async function (req, res) {
    if (db.connection.readyState !== 1 || !process.env.NC_MONGO_CONNECT_URL) {
      res.render('nc-admin/install-error');
    }

    res.render('nc-admin/install', {
      package: packageHelpers.getPackage(),
      themes: await themesHelpers.getThemes()
    });
  },
  checkInstallation: function (req, res, next) {
    const package = packageHelpers.getPackage();

    if (package.site_title && package.site_description && package.theme) {
      return res.redirect('/nc-admin/login');
    }

    next();
  },
  configure: async function (req, res) {
    try {
      var data = await boss.validate(req.body, {
        site_title: { required: true },
        site_description: { required: true, maxlength: 160 },
        user_login: { required: true },
        user_password: { required: true, minlength: 6 },
        user_password_repeat: { required: true, minlength: 6 },
        user_email: { required: true, email: true },
        theme: { required: true }
      });

      if (data.source.user_password_repeat !== data.source.user_password) {
        throw [{ 
            message: 'The passwords are wrong. Did you type correctly?', 
            name: 'user_password_repeat'
        }];
      }

      packageHelpers
        .addValue('site_title', data.source.site_title)
        .addValue('site_description', data.source.site_description)
        .addValue('theme', data.source.theme);

      return res.redirect('/nc-admin/login');
    } catch (e) {
      const package = packageHelpers.getPackage();
      
      res.render(`nc-admin/install`, {
        form_errors: e,
        package,
        themes: await themesHelpers.getThemes()
      });
    }
  }
}