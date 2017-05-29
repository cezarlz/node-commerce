'use strict';

const boss = require('boss-validator');
const themes = require('@helpers/themes');
const express = require('express');
const router = express.Router();
const bus = require('@helpers/bus');
const { countries, currencies } = require('country-data');

// Controllers
const AdminController = require('./controller');

router.get('/', (req, res) => {
  bus.publish(`seller.admin.pageLoad.home`, { req, res });

  return res.redirect('/admin/login');
});

router.get('/install', async (req, res) => {
  bus.publish(`seller.admin.pageLoad.install`, { req, res });

  if (!AdminController.hasDatabaseConnection) {
    bus.publish(`seller.admin.error.databaseConnection`, { req, res });

    return res.render(`admin/install-error`);
  }

  if (res.locals.settings) {
    return res.redirect('/admin/login');
  }

  return res.render('admin/install', {
    themes: await themes.getThemes(),
    data: {},
    countries: countries.all,
    currencies: currencies.all
  });
});

router.post('/install', async (req, res) => {
  bus.publish(`seller.admin.before.install`, { req, res });

  try {
    const data = await boss.validate(req.body, {
      name: { required: true },
      description: { required: true, maxlength: 160 },
      username: { required: true },
      password: { required: true, minlength: 10 },
      password_repeat: { required: true, minlength: 10 },
      email: { required: true, email: true },
      theme: { required: true },
      store_country: { required: true },
      currency_code: { required: true },
      ship_weight: { required: true },
      ship_dimension: { required: true }
    });

    const siteInfo = Object.assign({}, data.source, {
      home_url: res.locals.homeUrl()
    });

    const installation = await AdminController.createInstallation(siteInfo);

    bus.publish(`seller.admin.after.install`, { req, res, installation });

    return res.redirect('/admin/login');
  }
  catch (e) {
    bus.publish(`seller.admin.error.install`, { req, res, error: e });

    req.flash(e);

    return res.render('admin/install', {
      themes: await themes.getThemes(),
      data: req.body,
      flash: req.flash(),
      countries: countries.all,
      currencies: currencies.all
    });
  }
});

router.get('/login', (req, res) => {
  const status = req.query.status;

  bus.publish(`seller.admin.pageLoad.login`, { req, res });

  if (req.session.user) {
    return res.redirect('/admin/dashboard');
  }

  return res.render(`admin/login`);
});

router.post('/login', async (req, res) => {
  bus.publish(`seller.admin.before.login`, { req, res });

  try {
    const authUser = await AdminController.authenticate(req.body.username, req.body.password);

    bus.publish('seller.admin.after.login', { req, res, user: authUser });

    req.session.user = authUser;

    return res.redirect(`/admin/dashboard`);
  } catch (e) {
    bus.publish(`seller.admin.error.login`, { req, res, error: e });

    req.flash(e);

    return res.redirect(`/admin/login`);
  }
});

router.get('/logout', async (req, res) => {
  bus.publish('seller.admin.before.logout', { req, res, user: req.session.user });

  // Destroy session
  await req.session.destroy();

  bus.publish('seller.admin.after.logout', { req, res });

  return res.redirect('/admin/login?status=logout');
});

module.exports = router;