'use strict';

const themes = require('@helpers/themes');
const express = require('express');
const router = express.Router();

// Controllers
const AdminController = require('./controller');

const admin = new AdminController();

router.get('/', (req, res) => {
  return res.redirect('/admin/login');
});

router.get('/install', async (req, res) => {
  if (!admin.hasDatabaseConnection) {
    return res.render(`admin/install-error`);
  }

  if (res.locals.settings) {
    return res.redirect('/admin/login');
  }

  return res.render('admin/install', {
    themes: await themes.getThemes(),
    data: {}
  });
});

router.post('/install', async (req, res) => {
  try {
    const installation = await admin.createInstallation(req.body);

    return res.redirect('/admin/login');
  }
  catch (e) {
    req.flash(e);

    return res.render('admin/install', {
      themes: await themes.getThemes(),
      data: req.body,
      flash: req.flash()
    });
  }
});

router.get('/login', (req, res) => {
  const status = req.query.status;

  if (req.session.user) {
    return res.redirect('/admin/dashboard');
  }

  if (status) {
    switch (status) {
      case '400':
        req.flash({
          message: Flash.FLASH_MESSAGES.INVALID_USERNAME_PASSWORD,
          target: '.form-login',
          type: Flash.FLASH_TYPES.ALERT_ERROR
        });
        break;
      case '401':
        req.flash({
          message: Flash.FLASH_MESSAGES.NOT_AUTHORIZED,
          target: '.form-login',
          type: Flash.FLASH_TYPES.ALERT_ERROR
        });
        break;
      case '429':
        req.flash({
          message: Flash.FLASH_MESSAGES.MAX_LOGIN_ATTEMPT,
          target: '.form-login',
          type: Flash.FLASH_TYPES.ALERT_WARNING
        });
        break;
      case 'logout':
        req.flash({
          message: Flash.FLASH_MESSAGES.LOGOUT,
          target: '.form-login',
          type: Flash.FLASH_TYPES.ALERT_INFO
        });
        break;
      default:
        req.flash({
          message: Flash.FLASH_MESSAGES.GENERAL,
          target: '.form-login',
          type: Flash.FLASH_TYPES.ALERT_ERROR
        });
        break;
    }
  }

  return res.render(`admin/login`);
});

// router.post('/login', Admin.doLogin);

// router.get('/logout', Admin.doLogout);

module.exports = router;