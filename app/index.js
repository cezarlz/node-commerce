'use strict';

require('module-alias/register');
require('better-log/install');
require('dotenv').config();

/**
 * Dependencies
 */
const path = require('path');
const express = require('express');
const server = express();
const db = require('@db');
const config = require('@config');

const helmet = require('helmet');
const responseTime = require('response-time');
const morgan = require('morgan');
const cookie = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const locals = require('@middlewares/locals');
const flash = require('@middlewares/flash');
const settings = require('@middlewares/settings');

/**
 * Middlewares
 */
server.use(helmet());
server.use(responseTime());
server.use(morgan('tiny'));
server.use(cookie());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(session({
  secret: config.secret.key,
  name: config.secret.name,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: new Date(Date.now() + 2 * 60 * 60 * 1000)
  }
}));
server.use(locals);
server.use(flash);

/**
 * Setters
 */
server.set('views', `views`);
server.set('view engine', 'pug');
server.set('root', __dirname);

/**
 * Disable
 */
server.disable('x-powered-by');

/**
 * Routes
 */
server.use('/uploads', express.static(path.resolve(__dirname, './uploads')));
server.use('/admin', express.static(path.resolve(__dirname, './views/admin/assets')));

/**
 * Routers
 */
const clientRouter = require('@server/client/router');
const adminRouter = require('@server/admin/router');

server.use(settings);
server.use('/admin', adminRouter);
server.use('/', clientRouter);

/**
 * Run app, run!
 */
server.listen(config.port);