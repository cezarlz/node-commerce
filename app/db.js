const db = require('mongoose');
const config = require('@config');

/**
 * Promise
 */
db.Promise = global.Promise;

/**
 * Connect to Database
 */
db.connect(config.db.url);

module.exports = db;