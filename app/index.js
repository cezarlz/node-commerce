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
const glob = require('glob');
const type = require('type-detect');

const locals = require('@middlewares/locals');
const flash = require('@middlewares/flash');
const settings = require('@middlewares/settings');

const bus = require('@helpers/bus');

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
 * Custom Middlewares
 */
server.use('/uploads', express.static(path.resolve(__dirname, './uploads')));
server.use('/admin', express.static(path.resolve(__dirname, './views/admin/assets')));
server.use(locals);
server.use(flash);
server.use(settings);

/**
 * Routers
 */
const adminRouter = require('@server/admin/router');
const clientRouter = require('@server/client/router');


// Init
server.use((req, res, next) => {
  const { site_theme } = res.locals.settings;

  // Set the theme activated
  const theme = res.locals.theme = `themes/${site_theme}`;

  // Call function.js theme file
  glob(path.join(__dirname, `./views/${theme}/functions.js`), (err, file) => {
    if (file.length) {
      const functions = require(file[0]);

      if (type(functions).toLowerCase() === 'function') {
        functions(req, res);
      }
    }

    bus.publish('seller.init', { req, res });

    return next();
  });
});

server.use('/admin', adminRouter);
server.use('/', clientRouter);

/**
 * Run app, run!
 */
server.listen(config.port);