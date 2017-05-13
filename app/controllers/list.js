'use strict';

// Models
const Product = require('../models/Product');
const Order = require('../models/Order');

const renderList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const type = req.query.type;
    let data;
    let model;

    switch (type) {
      case 'products':
        model = Product;
        break;
      case 'orders':
        model = Order;
        break;
    }

    if (!model) throw new Error('Model not found.');

    data = await model.paginate({}, {
      page,
      limit
    });

    return res.render(`admin/dashboard/${type}/list`, {
      data
    });
  }
  catch (err) {
    console.log(err);
  }
};

module.exports = {
  renderList
};