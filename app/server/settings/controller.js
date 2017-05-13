'use strict';

const Flash = require('@helpers/flash');

const SettingsModel = require('./model');

const Settings = function (settings = null) {
  this.settings = settings;
};

Settings.prototype.create = async function (data = {}) {
  this.settings = Object.assign({}, this.settings, data);

  try {
    const settings = new SettingsModel(this.settings);

    await settings.save();

    this.settings = settings;
  }
  catch (e) {
    console.log('%j', e);
  }
};

Settings.prototype.get = async function () {
  try {
    const settings = await SettingsModel.findOne();

    if (settings) this.settings = settings;

    return settings;
  }
  catch (e) {
    console.log('%j', e);
  }
};

Settings.prototype.hasSettings = async function () {
  try {
    const settings = await this.get();

    if (!settings) return false;

    return true;
  }
  catch (e) {
    console.log('%j', e);
  }
};

module.exports = Settings;