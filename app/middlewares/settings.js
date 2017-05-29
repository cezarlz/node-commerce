'use strict';

const Settings = require('@server/settings/controller');

module.exports = async (req, res, next) => {
  try {
    const hasSettings = await Settings.hasSettings();

    if (!hasSettings && !res.locals.isInstall()) {
      return res.redirect('/admin/install');
    }

    res.locals.settings = req.session.settings = await Settings.get();

    return next();
  }
  catch (err) {
    return next(err);
  }
};