const db = require('../db');
const packageHelpers = require('../helpers/package-helpers');
const themesHelpers = require('../helpers/themes-helpers');

module.exports = {
  checkDatabaseConnection: async (req, res, next) => {
    if (!db.connection.readyState || !process.env.NC_MONGO_CONNECT_URL) {
      return res.render('nc-admin/install', {
        package: packageHelpers.getPackage(),
        themes: await themesHelpers.getThemes()
      });
    }

    next();
  },

  checkInstallation: (req, res, next) => {
    const package = packageHelpers.getPackage();

    if (!package.site_title || !package.site_description || !package.theme) {
      return res.redirect('/nc-admin/install');
    }

    next();
  }
};