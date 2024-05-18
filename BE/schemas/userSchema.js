// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  isEmailSynced: { type: Boolean, default: false}
});

const User = mongoose.model('User', userSchema);
module.exports = User;
