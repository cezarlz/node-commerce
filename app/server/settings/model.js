'use strict';

const db = require('@db');
const { Schema } = db;

const schema = {
  site_name: String,
  site_description: String,
  site_theme: String,
  plugins_activated: [String]
};

const settingsSchema = new Schema(schema);

const Settings = db.model('Settings', settingsSchema);

module.exports = Settings;