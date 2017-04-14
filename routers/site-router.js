const fs = require('fs');
const express = require('express');
const router = express.Router();

/**
 * Gets
 */
router.get('/', (req, res) => {
  res.render(`index`);
});

router.get('/cart', (req, res) => {
  res.render(`cart`, {
    teste: 'teste'
  });
});

router.get('/checkout', (req, res) => {
  res.render(`checkout`);
});

router.get('/order/:id', (req, res) => {
  res.render(`order`);
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
 * 404
 */
router.use((req, res, next) => {
  // Helpers
  res.locals.is_404 = function () {
    return true;
  };

  // 404 Requests
  res
    .status(404)
    .render(`404`);

  next();
});

router.use((err, req, res, next) => {
  if (err.stack.indexOf('"views"') !== -1) {
    try {
      if (!fs.existsSync(`./views/${req.app.get('theme')}/index.pug`)) {
        throw new Error('The file index.pug was not found.');
      }

      res.render(`index`);
    }
    catch (e) {
      res
        .status(500)
        .send(`
          <h1>${e.message}</h1>
          <pre>${e.stack}</pre>
        `);
    }
  }
  
  next(err);
});

module.exports = router;