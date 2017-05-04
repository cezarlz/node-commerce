const express = require('express');
const router = express.Router();
const { 
  home, 
  install, 
  configure,
  checkInstallation
} = require('../controllers/admin-controller');
router.get('/', home);

router.all('/install', checkInstallation);
router.get('/install', install);
router.post('/install', configure);

router.get('/login', (req, res) => {
  res.send('login!');
});

module.exports = router;