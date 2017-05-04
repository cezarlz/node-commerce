const db = require('mongoose');

/**
 * Promise
 */
db.Promise = global.Promise;

/**
 * Connect to Database
 */
db.connect(process.env.NC_MONGO_CONNECT_URL);

module.exports = db;