const mongoose = require('mongoose');

const authoritySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  department: String,
  location: String, // Optional: like Zone A, South, etc.
});

module.exports = mongoose.model('Authority', authoritySchema);
