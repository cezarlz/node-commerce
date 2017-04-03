/**
 * Dependencies
 */
const express = require('express');
const _ = require('lodash');
const helmet = require('helmet');
const responseTime = require('response-time');
const pjson = require('./package.json');

/**
 * Variables
 */
const server = express();


/**
 * Middlewares
 */
server.use(helmet());
server.use(responseTime());

/**
 * Setters
 */
server.set('views', `views`);
server.set('view engine', 'pug');

/**
 * Routes & Routers
 */
const siteRouter = require('./routers/site-router');
const adminRouter = require('./routers/admin-router');

server.use('/', siteRouter);
server.use('/nc-admin', adminRouter);

server.listen(process.env.NC_PORT);