'use strict';

const numeral = require('numeral');
const Flash = require('@helpers/flash');

// Models
const ProductModel = require('./model');

const Product = {};

Product.create = async function (product = {}) {
  try {
    console.log(product);

    // Sale price cannot be bigger than price
    if (numeral(product.sale_price).value() >= numeral(product.price).value()) {
      throw new Flash({
        message: Flash.FLASH_MESSAGES.SALE_PRICE_BIGGER_PRICE,
        type: Flash.FLASH_TYPES.ALERT_INPUT,
        name: 'sale_price'
      });
    }

    // Generate attributes
    product.attributes = Product.generateProductAttributes(product.attributes);

    // Reviews allowed?
    product.reviews_allowed = product.reviews_allowed === 'yes';

    // Sold individually?
    product.reviews_allowed = product.sold_individually === 'yes';

    // Cover
    if (product.cover) {
      product.cover = product.cover[0].path;
    }

    // Galerry
    if (product['gallery[]']) {
      product.gallery = product['gallery[]'].map(file => {
        return file.path;
      });
    }

    let item = new ProductModel(product);

    await item.save();

    return Promise.resolve(item);
  }
  catch (e) {
    console.log(e);

    return Promise.reject(e);
  }
};

Product.generateProductAttributes = async function (attributes = null) {
  if (!attributes) return null;

  let data = [];

  attributes = attributes.split('\r\n');

  attributes.forEach(attr => {
    let matchFormat = /^(.+) \| (?!,)(.+)$/.test(attr);

    if (!matchFormat) return;

    let index = attr.split('|')[0].trim();
    let values = attr.split('|')[1].trim().split(',').map(value => {
      return value.trim();
    });

    data.push({ index, values });
  });

  return data;
};

Product.find = async function (options = {}, page = 1, limit = 20) {
  try {
    return await ProductModel.paginate(options, { page, limit });
  }
  catch (e) {
    return Promise.reject(new Flash(e));
  }
};

module.exports = {
  create: Product.create,
  find: Product.find
};