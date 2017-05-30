'use strict';

const db = require('@db');
const { Schema } = db;
const paginate = require('mongoose-paginate');
const slug = require('mongoose-slug-generator');

const schema = {
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    slug: 'name'
  },
  description: String,
  status: Boolean
};

const categorySchema = new Schema(schema, {
  timestamps: true
});


// Plugins
categorySchema.plugin(paginate);
categorySchema.plugin(slug);

const Category = db.model('Category', categorySchema);