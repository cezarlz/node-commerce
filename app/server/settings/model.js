'use strict';

const db = require('@db');
const { Schema } = db;

const schema = {
  name: String,
  description: String,
  theme: String,
  home_url: String,
  plugins_activated: [String],
  store_country: String,
  currency_code: String,
  currency_symbol: {
    type: String,
    default: '$'
  },
  currency_format: {
    type: String,
    default: '%s%v'
  },
  ship_weight: String,
  ship_dimension: String
};

const settingsSchema = new Schema(schema);

const Settings = db.model('Settings', settingsSchema);

module.exports = Settings;