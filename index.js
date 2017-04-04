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
server.use(themes);

/**
 * Setters
 */
server.set('views', `views`);
server.set('view engine', 'pug');
server.set('theme', `themes/venus`);

/**
 * Routes
 */

server.use('/', siteRouter);
server.use('/nc-admin', adminRouter);

server.listen(process.env.NC_APP_PORT);