'use strict';

const SettingsController = require('@server/settings/controller');

module.exports = async (req, res, next) => {
  try {
    if (req.session.settings) {
      res.locals.settings = req.session.settings;
      return next();
    }

    const settings = new SettingsController();
    const hasSettings = await settings.hasSettings();

    if (!hasSettings && !res.locals.isInstall()) {
      return res.redirect('/admin/install');
    }

    res.locals.settings = req.session.settings = settings.settings;

    return next();
  }
  catch (err) {
    return next(err);
  }
};