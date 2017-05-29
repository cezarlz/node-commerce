'use strict';

const Flash = require('@helpers/flash');

const SettingsModel = require('./model');

const Settings = {};

Settings.create = async function (data = {}) {
  try {
    // Find existent setting
    let settings = await SettingsModel.findOne({});

    if (!settings) settings = new SettingsModel(data);

    await settings.validate();

    await settings.save();

    return settings;
  }
  catch (e) {
    return Promise.reject(e);
  }
};

Settings.update = async function (data = {}) {
  try {
    let settings = await SettingsModel.findOne({});

    settings = Object.assign({}, settings, data);

    await settings.validate();

    await settings.save();

    return settings;
  }
  catch (e) {
    return Promise.reject(e);
  }
};

Settings.get = async function () {
  try {
    return await SettingsModel.findOne({});
  }
  catch (e) {
    return Promise.reject(e);
  }
};

Settings.getField = async function (field = null) {
  try {
    const settings = await Settings.get();

    if (settings && !field) return settings;

    if (settings[field]) return settings[field];

    return settings;
  }
  catch (e) {
    return Promise.reject(e);
  }
};

Settings.hasSettings = async function () {
  try {
    const settings = await Settings.get();

    if (!settings) return false;

    return true;
  }
  catch (e) {
    return Promise.reject(e);
  }
};

module.exports = Settings;