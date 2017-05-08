const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('../controllers/admin');

router.get('/', adminController.renderHome);

router.all('/install', adminController.checkInstallation);
router.get('/install', adminController.renderInstall);
router.post('/install', adminController.doInstall);

router.get('/login', adminController.renderLogin);
router.post('/login', adminController.doLogin);

module.exports = router;