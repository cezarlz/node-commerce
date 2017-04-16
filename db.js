const db = require('mongoose');

/**
 * Promise
 */
db.Promise = global.Promise;

/**
 * Database
 */
db.connect(process.env.NC_DB_NAME);

module.exports = db;