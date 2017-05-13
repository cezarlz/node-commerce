'use strict';

const db = require('@db');
const configs = require('../helpers/configs');
const themesHelpers = require('../helpers/themes');

module.exports = {
  checkDatabaseConnection: async (req, res, next) => {
    if (!db.connection.readyState || !process.env.NC_MONGO_CONNECT_URL) {
      return res.render('admin/install', {
        configs: configs.getConfigs(),
        themes: await themesHelpers.getThemes()
      });
    }

    next();
  },

  checkInstallation: (req, res, next) => {
    const c = configs.getConfigs();

    if (!c.site_title || !c.site_description || !c.theme) {
      return res.redirect('/admin/install');
    }

    next();
  }
};