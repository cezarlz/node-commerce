'use strict';

const boss = require('boss-validator');
const numeral = require('numeral');
const Flash = require('../helpers/flash');

// Models
const ProductModel = require('../models/Product');

const

class Product {
  constructor(product = {}) {
    this.product = product;
  }

  create(product = {}) {
    this.product = product;

    try {
      let validate = await boss.validate(this.product, {
        title: { required: true },
        status: { required: true },
        price: { required: true },
        type: { required: true }
      });

      let { source } = validate;

      console.log('%j', source);

      // Sale price cannot be bigger than price
      if (numeral(source.sale_price).value() >= numeral(source.price).value()) {
        throw new Flash({
          message: Flash.FLASH_MESSAGES.SALE_PRICE_BIGGER_PRICE,
          type: Flash.FLASH_TYPES.ALERT_INPUT,
          name: 'sale_price'
        });
      }

      // Generate attributes
      source.attributes = generateAttributes(source.attributes);

      // Reviews allowed?
      source.reviews_allowed = source.reviews_allowed === 'yes';

      // Sold individually?
      source.reviews_allowed = source.sold_individually === 'yes';

      // Cover
      source.cover = source.files.cover[0].path;

      // Galerry
      source.gallery = source.files['gallery[]'].map(file => {
        return file.path;
      });

      let item = new Product(source);

      await item.save();

      return Promise.resolve(item);
    }
    catch (e) {
      return Promise.reject(e);
    }
  }

  generateAttributes(attributes) {
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
  }
}

module.exports = Product;