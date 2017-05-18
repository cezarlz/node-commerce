'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const configs = require('@helpers/configs');
const bus = require('@helpers/bus');

// Set path of static resources
router.use(express.static(path.resolve(__dirname, `../../views/themes/`)));

router.use((req, res, next) => {
  bus.publish(`seller.client.init`, { req, res });

  return next();
});

/**
 * Gets
 */
router.get('/', async (req, res) => {
  bus.publish('seller.client.loadPage.home', { req, res });

  return res.render(`${res.locals.theme}/index`);
});

router.get('/cart', (req, res) => {
  bus.publish('seller.client.loadPage.cart', { req, res });

  return res.render(`${res.locals.theme}/cart`);
});

router.get('/checkout', (req, res) => {
  bus.publish('seller.client.loadPage.checkout', { req, res });

  return res.render(`${res.locals.theme}/checkout`);
});

router.get('/order/:id', (req, res) => {
  bus.publish(`seller.client.loadPage.order`, { req, res });
  bus.publish(`seller.client.loadPage.order:${req.params.id}`, { req, res });

  return res.render(`${res.locals.theme}/order`);
});

router.get('/product/:slug', (req, res) => {
  bus.publish('seller.client.loadPage.product', { req, res });
  bus.publish(`seller.client.loadPage.product:${req.params.slug}`, { req, res });

  return res.render(`${res.locals.theme}/product`);
});

router.get('/category/:category', (req, res) => {
  bus.publish('seller.client.loadPage.category', { req, res });
  bus.publish(`seller.client.loadPage.category:${req.params.category}`, { req, res });

  return res.render(`${res.locals.theme}/category`);
});

router.get('/page/:pageSlug', (req, res) => {
  bus.publish('seller.client.loadPage.page', { req, res });
  bus.publish(`seller.client.loadPage.page:${req.params.pageSlug}`, { req, res });

  return res.render(`${res.locals.theme}/page`);
});

/**
 * Posts
 */
router.post('/product/:slug', (req, res) => {

});

router.post('/cart', (req, res) => {

});

router.post('/checkout', (req, res) => {

});

/**
 * 404
 */
router.use((req, res, next) => {
  // Helpers
  res.locals.is404 = function () {
    return true;
  };

  bus.publish('seller.client.notfound', { req, res });

  if (!res.locals.isAdmin()) {
    // 404 Requests
    res
      .status(404)
      .render(`${res.locals.theme}/404`);
  }

  return next();
});

router.use((err, req, res, next) => {
  const theme = res.locals.theme;

  if (err.stack.indexOf('"views"') !== -1) {
    try {
      if (!fs.existsSync(`./views/${theme}/index.pug`)) {
        throw new Error('The file index.pug was not found.');
      }

      const page = req.originalUrl
        .replace(/^\//g, '')
        .replace(/\//g, '-')
        .toLowerCase();

      bus.publish(`seller.client.loadPage.${page}`, { req, res });

      return res.render(`${res.locals.theme}/index`);
    }
    catch (e) {
      bus.publish(`seller.client.error.notFoundThemeFile`, { err, req, res });

      return res
        .status(500)
        .send(`
          <h1>${e.message}</h1>
          <pre>${e.stack}</pre>
        `);
    }
  }

  return next(err);
});

module.exports = router;