require('dotenv').config();

/**
 * Dependencies
 */
const express = require('express');
const db = require('./db');

const helmet = require('helmet');
const responseTime = require('response-time');
const morgan = require('morgan');
const pjson = require('./package.json');
const helpers = require('./includes/helpers');
const cookie = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

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
// Check Installation
server.use('/nc-admin', adminRouter);
server.use('/', siteRouter);

/**
 * Run app, run!
 */
server.listen(process.env.PORT || 3000);