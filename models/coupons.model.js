const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  minimum_transaction_amount: {
    type: Number,
    required: true
  },
  item_id:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item"
  }],
  is_item_specific:{
    type: Boolean
  },
  coupon_Type:{
    type: String,
    enum: ['Percentage', 'Flat'],
    required: true
  },
  discount_in_percent: {
    type: Number,
    required: true
  },
  flat_amount_Of:{
    type: Number,
    required: true
  },
  maximum_discout:{
    type: Number,
    required: true
  },
  marketing_text: {
    type: String,
    required: true
  },
  terms: {
    type: String,
    required: true
  }
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
