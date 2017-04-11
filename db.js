const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

/**
 * Database
 */
mongoose.connect(process.env.NC_DB_NAME);

module.exports = mongoose.connection;