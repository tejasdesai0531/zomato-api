const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  minimum_transaction_amount: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  maximum_discout: {
    type: Number,
    required: true
  }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
