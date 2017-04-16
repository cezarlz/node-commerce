const db = require('../db');
const { Schema } = db;
const ip = require('ip');

const orderSchema = new Schema({
  amount: {
    total: { type: Number, required: true, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 }
  },
  status: {
    type: String,
    default: 'opened' // ['opened', 'pending', 'paid', 'processing', 'completed']
  },
  currency: { type: String, required: true },
  customer_id: { type: Schema.Types.ObjectId, default: null },
  billing: {
    first_name: { type: String },
    last_name: { type: String },
    company: { type: String },
    address_1: { type: String },
    address_2: { type: String },
    state: { type: String },
    postcode: { type: String },
    country: { type: String },
    email: { type: String, required: true },
    phone: { type: String }
  },
  shipping: {
    first_name: { type: String },
    last_name: { type: String },
    company: { type: String },
    address_1: { type: String },
    address_2: { type: String },
    state: { type: String },
    postcode: { type: String },
    country: { type: String }
  },
  payment: {
    method: { type: String, required: true },
    name: { type: String, required: true }
  },
  customer: {
    ip: { type: String, default: ip.address() },
    user_agent: { type: String }
  },
  note: { type: String },
  paid_at: { type: Date }
});

const Order = db.model('Order', orderSchema);

module.exports = Order;