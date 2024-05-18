// models/User.js
const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  VENDOR_NAME: { type: String, default: '' },
  SUBTOTAL: { type: String, default: '' },
  INVOICE_RECEIPT_DATE: { type: String, default:'' }, // assuming you want the default to be the current date
  TAX: { type: String, default: '' },
  TOTAL: { type: String, default: '' },
  VENDOR_ADDRESS: { type: String, default: '' },
  ZIP_CODE: { type: String, default: '' },
  CATEGORY: { type: String, default: '' },
  FILE_NAME: { type: String, default: '' },
});

const userSchema = new mongoose.Schema({
  email: String,
  isEmailSynced: { type: Boolean, default: false},
  receipts: { type: [receiptSchema], default: [] },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
