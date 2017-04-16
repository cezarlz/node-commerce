const fs = require('fs');
const express = require('express');
const router = express.Router();

// Set theme
router.use((req, res, next) => {
  const theme = `themes/venus`;

  res.locals.theme = theme;

  router.use(express.static(`views/${theme}`));

  next('route');
});

/**
 * Gets
 */
router.get('/', async (req, res) => {
  res.render(`${res.locals.theme}/index`);
});

router.get('/cart', (req, res) => {
  res.render(`${res.locals.theme}/cart`, {
    teste: 'teste'
  });
});

router.get('/checkout', (req, res) => {
  res.render(`${res.locals.theme}/checkout`);
});

router.get('/order/:id', (req, res) => {
  res.render(`${res.locals.theme}/order`);
});

router.get('/product/:slug', (req, res) => {
  res.render(`${res.locals.theme}/product`);
});

router.get('/category/:category', (req, res) => {
  res.render(`${res.locals.theme}/category`);
});

router.get('/page/:pageSlug', (req, res) => {
  res.render(`${res.locals.theme}/page`);
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

  if (!res.locals.is_admin) {
    // 404 Requests
    res
      .status(404)
      .render(`${res.locals.theme}/404`);
  }

  next();
});

router.use((err, req, res, next) => {
  const theme = res.locals.theme;

  if (err.stack.indexOf('"views"') !== -1) {
    try {
      if (!fs.existsSync(`./views/${theme}/index.pug`)) {
        throw new Error('The file index.pug was not found.');
      }

      res.render(`${res.locals.theme}/index`);
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