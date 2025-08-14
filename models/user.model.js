const mongoose = require('mongoose');

const userDetails = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  resetCode: {
    type: String
  },
  resetCodeExpires: {
    type: Date
  },
  profilePhoto: {
  type: String
},


}, {
  timestamps: true
});

module.exports = mongoose.model('User', userDetails);
