'use strict';

const express = require('express');
const router = express.Router();
const boss = require('boss-validator');
const bus = require('@helpers/bus');
const upload = require('@helpers/upload');
const Flash = require('@helpers/Flash');

const Product = require('@server/products/controller');

router.get('/', async (req, res) => {
  return res.render(`admin/dashboard/products/index`, {
    data: await Product.find({}, req.query.page, req.query.limit)
  });
});

router.get('/create', async (req, res) => {
  return res.render(`admin/dashboard/products/create`, {
    data: {}
  });
});

const productFileFields = upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'gallery[]', maxCount: 8 }
]);
router.post('/create', productFileFields, async (req, res) => {
  try {
    let productData = Object.assign({}, req.body, req.files);

    let validate = await boss.validate(productData, {
      name: { required: true },
      status: { required: true },
      price: { required: true }
    });

    const product = await Product.create(validate.source);

    req.flash({
      message: `Success! Product created.`,
      type: Flash.FLASH_TYPES.ALERT_SUCESS,
    });

    return res.redirect(`/admin/dashboard/products/${product._id}`);
  }
  catch (e) {
    req.flash(e);

    return res.render(`admin/dashboard/products/create`, {
      data: req.body
    });
  }
});

module.exports = router;