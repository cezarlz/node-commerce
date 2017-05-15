'use strict';

const Flash = require('@helpers/flash');

const SettingsModel = require('./model');

const Settings = function (settings = null) {
  this.settings = settings;
};

Settings.prototype.create = async function (data = {}) {
  try {
    // Find existent setting
    let settings = await SettingsModel.findOne({});

    if (!settings) settings = new SettingsModel(Object.assign({}, this.settings, data));

    await settings.validate();

    await settings.save();

    this.settings = settings;
  }
  catch (e) {
    return Promise.reject(e);
  }
};

Settings.prototype.update = async function (data = {}) {
  try {
    let settings = await SettingsModel.findOne({});

    settings = Object.assign({}, settings, data);

    await settings.validate();

    await settings.save();

    this.settings = settings;

    return settings;
  }
  catch (e) {
    return Promise.reject(e);
  }
};

Settings.prototype.get = async function () {
  try {
    const settings = await SettingsModel.findOne({});

    if (settings) this.settings = settings;

    return settings;
  }
  catch (e) {
    return Promise.reject(e);
  }
};

Settings.prototype.getField = async function (field = null) {
  try {
    const settings = await this.get();

    if (settings && !field) return settings;

    if (settings[field]) return settings[field];

    return settings;
  }
  catch (e) {
    return Promise.reject(e);
  }
};

Settings.prototype.hasSettings = async function () {
  try {
    const settings = await this.get();

    if (!settings) return false;

    return true;
  }
  catch (e) {
    return Promise.reject(e);
  }
};

module.exports = Settings;