'use strict';

const Flash = require('../helpers/flash');
const Boss = require('boss-validator');

// Controllers
const productController = require('./product');

const renderForm = async (req, res) => {
  try {
    const type = req.query.type;

    return res.render(`admin/dashboard/${type}/add`);
  }
  catch (e) {

  }
};

const addItem = async (req, res) => {
  const type = req.body.type;
  let item;

  try {
    switch (type) {
      case 'products':
        const product = Object.assign({}, req.body, { files: req.files });
        item = await productController.addProduct(product);
        break;
    }

    return res.redirect(`admin/dashboard/edit?type=${type}&id=${item._id}&action=edit&status=new`);
  }
  catch (e) {
    if (e instanceof Flash) {
      req.flash.set(e.list());
    }

    if (Array.isArray(e)) {
      req.flash.set(e);
    }

    return res.redirect(`/admin/dashboard/add?type=${type}`);
  }
};

module.exports = {
  renderForm,
  addItem
};