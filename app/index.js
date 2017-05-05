'use strict';

require('dotenv').config();

/**
 * Dependencies
 */
const path = require('path');
const express = require('express');
const server = express();
const db = require('./db');

const helmet = require('helmet');
const responseTime = require('response-time');
const morgan = require('morgan');
const cookie = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

/**
 * Controllers
 */
const envController = require('./controllers/env');

/**
 * Helpers
 */
const helpers = require('./helpers/helpers');
const configs = require('./helpers/configs');

/**
 * Routers
 */
const siteRouter = require('./routers/site');
const adminRouter = require('./routers/admin');

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
  secret: '1a24eec8-44c1-4757-b902-5aace4b88e30', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));
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
server.use('/nc-admin', express.static(path.resolve(__dirname, './views/nc-admin/assets')));
server.use((req, res, next) => {
  const c = configs.getConfigs();
  
  const isInstalled = (c.site_title || c.site_description || c.theme);

  if (!res.locals.isInstall() && !isInstalled) {
    return res.redirect('/nc-admin/install');
  }

  next();
});

server.use('/nc-admin', adminRouter);
server.use('/', siteRouter);

/**
 * Run app, run!
 */
server.listen(process.env.PORT || 3000);