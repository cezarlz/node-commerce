const express = require('express');
const router = express.Router();
const { 
  home, 
  install, 
  configure
} = require('../controllers/admin-controller');
const { checkInstallation } = require('../controllers/env-controller');

router.get('/', home);

router.get('/install', install);
router.post('/install', configure);

router.get('/login', (req, res) => {
  res.send('login!');
});

module.exports = router;