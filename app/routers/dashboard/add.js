'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const upload = require('../../helpers/upload');

// Controllers
const addController = require('../../controllers/add');

router.get(
  '/',
  // auth(),
  addController.renderForm
);

router.post(
  '/',
  upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'gallery[]', maxCount: 8 }]),
  addController.addItem
)

module.exports = router;