'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

// Controllers
const listController = require('../../controllers/list');

router.get(
  '/',
  // auth(),
  listController.renderList
);

module.exports = router;