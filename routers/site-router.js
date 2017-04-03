const express = require('express');
const router = express.Router();
const pjson = require('../package.json');

/**
 * Gets
 */
router.get('/', (req, res) => {
  res.render(`themes/${pjson.theme}/index`, {
    foo: 'bar'
  });
});

router.get('/cart', (req, res) => {
  res.render(`themes/${pjson.theme}/cart`);
});

router.get('/checkout', (req, res) => {
  res.render(`themes/${pjson.theme}/checkout`);
});

router.get('/order/:id', (req, res) => {

});

router.get('/product/:slug', (req, res) => {
  res.render(`themes/${pjson.theme}/product`);
});

router.get('/category/:category', (req, res) => {
  res.render(`themes/${pjson.theme}/category`);
});

router.get('/page/:pageSlug', (req, res) => {
  res.render(`themes/${pjson.theme}/page`);
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
 * Middlewares
 */
router.use((err, req, res, next) => {
  if (err.hasOwnProperty('view')) {
    res.render(`themes/${pjson.theme}/index`);
  }

  if (err.stack.indexOf('views') !== -1) {
    res.status(500).send('<h1>The file index.pug was not found.</h1>');
  }
  
  next();
});

module.exports = router;