'use strict';

const db = require('@db');
const { Schema } = db;
const paginate = require('mongoose-paginate');
const slug = require('mongoose-slug-generator');

const schema = {
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    slug: 'title'
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'private'],
    default: 'published'
  },
  content: String,
  price: {
    type: Number,
    required: true,
    min: 1
  },
  sale_price: {
    type: Number,
    min: 1
  },
  stock: {
    sku: String,
    status: {
      type: String,
      enum: ['instock', 'outofstock'],
      default: 'instock',
      required: true
    },
    qty: {
      type: Number,
      min: 0
    }
  },
  sold_individually: {
    type: Boolean,
    default: false
  },
  ship: {
    weight: {
      type: Number,
      default: 0
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    shipping_class: String
  },
  attributes: [Schema.Types.Mixed],
  categories: [String],
  reviews_allowed: {
    type: Boolean,
    default: true
  },
  note: String,
  cover: String,
  gallery: [String]
};

const preSave = function (next) {
  if (this.cover) {
    // Remove /src from cover and gallery
    this.cover = this.cover.replace(/\/src/g, '');
  }

  if (this.gallery) {
    this.gallery = this.gallery.map(file => {
      return file.replace(/\/src/g, '');
    });
  }

  return next();
};

const productSchema = new Schema(schema, {
  timestamps: true
});

productSchema.pre('save', preSave);

// Plugins
productSchema.plugin(paginate);
productSchema.plugin(slug);

const Product = db.model('Product', productSchema);

module.exports = Product;