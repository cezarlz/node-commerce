const db = require('../db');
const { Schema } = db;

const configSchema = new Schema({
  url: String,
  theme: { type: String, default: 'venus' },
  site_title: { type: String, default: 'Awesome Shop' },
  site_description: { type: String, default: 'The best shop on the internet!' },
  is_site_installed: { type: Boolean, default: false }
});

const Config = db.model('Config', configSchema);

module.exports = Config;