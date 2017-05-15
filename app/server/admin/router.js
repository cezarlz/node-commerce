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

  return res.render(`admin/login`);
});

router.post('/login', async (req, res) => {
  let errors = [];

  try {
    const authUser = await admin.authenticate(req.body.username, req.body.password);

    req.session.user = authUser;

    return res.redirect(`/admin/dashboard`);
  } catch (e) {
    req.flash(e);

    return res.redirect(`/admin/login`);
  }
});

router.get('/logout', async (req, res) => {
  // Destroy session
  await req.session.destroy();

  return res.redirect('/admin/login?status=logout');
});

module.exports = router;