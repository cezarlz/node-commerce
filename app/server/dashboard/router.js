'use strict';

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  return res.render(`admin/dashboard/index`);
});

module.exports = router;