const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billId: { type: String, unique: true, required: true },
  category: { type: String, required: true },
  biller: { type: String, required: true },
  consumerNumber: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  billDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
