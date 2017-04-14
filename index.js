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
server.use(helpers);

/**
 * Setters
 */
server.set('views', `views`);
server.set('view engine', 'pug');
server.set('theme', `themes/venus`);
server.set('root', __dirname);

/**
 * Routes
 */
server.use('/', siteRouter);
server.use('/nc-admin', adminRouter);


// const Order = require('./models/Order');

// let o = new Order({
//   amount: {
//     total: 200,
//     shipping: 12,
//     tax: 0
//   },
//   status: 'pending',
//   currency: 'USD',
//   billing: {
//     first_name: 'Cezar Luiz',
//     last_name: 'Sampaio',
//     company: null,
//     address_1: 'Rua Candido Xavier 1426',
//     address_2: 'AP 65A',
//     state: 'PR',
//     postcode: '80320220',
//     country: 'BR',
//     email: 'cezar@ebanx.com',
//     phone: '41999755823'
//   },
//   payment: {
//     method: 'ebanx-credit-card',
//     name: 'EBANX - Credit Card'
//   },
//   customer: {
//     ip: '172.0.0.2',
//     user_agent: 'Mozzila 5.0'
//   },
//   note: 'Meu endereço fica perto do Festval',
//   paid_at: new Date
// });

// let order = o.save();

/**
 * Run app, run!
 */
server.listen(process.env.PORT || 3000);