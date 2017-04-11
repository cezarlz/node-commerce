const mongoose = require('mongoose');

/**
 * Database
 */
mongoose.connect(process.env.NC_DB_NAME);

module.exports = mongoose.connection;