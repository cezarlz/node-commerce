require('dotenv').config();

/**
 * Dependencies
 */
const express = require('express');
const _ = require('lodash');
const helmet = require('helmet');
const responseTime = require('response-time');
const morgan = require('morgan');
const pjson = require('./package.json');
const themes = require('express-theme-pug');
const db = require('./db');
const helpers = require('./includes/helpers');

/**
 * Models
 */
const Config = require('./models/Config');

/**
 * Routers
 */
const siteRouter = require('./routers/site-router');
const adminRouter = require('./routers/admin-router');

/**
 * Variables
 */
const server = express();


/**
 * Middlewares
 */
server.use(helmet());
server.use(responseTime());
server.use(morgan('tiny'));
server.use(helpers);

/**
 * Setters
 */
server.set('views', `views`);
server.set('view engine', 'pug');
server.set('root', __dirname);

/**
 * Routes
 */
// Check Installation
server.use('/nc-admin', adminRouter);
server.use('/', siteRouter);

/**
 * Run app, run!
 */
server.listen(process.env.PORT || 3000);