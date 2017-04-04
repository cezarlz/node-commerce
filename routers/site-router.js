const express = require('express');
const router = express.Router();

/**
 * Gets
 */
router.get('/', (req, res) => {
  res.render(`index`, {
    foo: 'bar'
  });
});

router.get('/cart', (req, res) => {
  res.render(`cart`);
});

router.get('/checkout', (req, res) => {
  res.render(`checkout`);
});

router.get('/order/:id', (req, res) => {

});

router.get('/product/:slug', (req, res) => {
  res.render(`product`);
});

router.get('/category/:category', (req, res) => {
  res.render(`category`);
});

router.get('/page/:pageSlug', (req, res) => {
  res.render(`page`);
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
    res.render(`index`);
  }

  if (err.stack.indexOf('views') !== -1) {
    res.status(500).send('<h1>The file index.pug was not found.</h1>');
  }

  next();
});

module.exports = router;