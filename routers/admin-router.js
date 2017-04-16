const express = require('express');
const router = express.Router();

router.use(express.static('views/admin/assets'));

router.get('/', (req, res) => {
  res.render('admin/index');
});

router.get('/install', (req, res) => {
  res.render('admin/install', {
    sidebar: false
  });
});

router.post('/install', (req, res) => {

});

module.exports = router;