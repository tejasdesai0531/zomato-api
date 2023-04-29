const mongoose = require('mongoose');

const fcmSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  }
});

const Fcm = mongoose.model('FCM', fcmSchema);

module.exports = Fcm;
