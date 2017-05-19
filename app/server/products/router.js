'use strict';

const express = require('express');
const router = express.Router();
const bus = require('@helpers/bus');

const Products = require('@server/products/controller');

router.get('/', async (req, res) => {
  const products = new Products();

  return res.render(`admin/dashboard/products/index`, {
    data: await products.find({}, req.query.page, req.query.limit)
  });
});

router.get('/create', async (req, res) => {
  return res.render(`admin/dashboard/products/create`);
});

module.exports = router;