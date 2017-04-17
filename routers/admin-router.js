const express = require('express');
const router = express.Router();
const boss = require('boss-validator');
const db = require('../db');
const package = require('../package.json');
const packageHelpers = require('../includes/package-helpers');

router.use(express.static('views/admin/assets'));

router.get('/', (req, res) => {
  res.render('admin/index');
});

router.get('/install', (req, res) => {
  if (!db.connection.readyState || !process.env.NC_MONGO_CONNECT_URL) {
    res.render('admin/install-error');
  }

  res.render('admin/install', {
    package
  });
});

router.post('/install', async (req, res) => {
  try {
    var data = await boss.validate(req.body, {
      site_title: { required: true },
      site_description: { required: true, maxlength: 160 },
      user_login: { required: true },
      user_password: { required: true, minlength: 6 },
      user_password_repeat: { required: true, minlength: 6 },
      user_email: { required: true, email: true }
    });

    if (req.body.user_password_repeat !== req.body.user_password) {
      throw [{ 
          message: 'The passwords are wrong. Did you type correctly?', 
          name: 'user_password_repeat'
      }];
    }

    packageHelpers
      .addValue('site_title', data.source.site_title)
      .addValue('site_description', data.source.site_description);

    res.redirect('/nc-admin/login');
  } catch (e) {
    res.render(`admin/install`, {
      form_errors: e,
      package
    });
  }
});

router.get('/login', (req, res) => {
  res.send('login!');
});

module.exports = router;