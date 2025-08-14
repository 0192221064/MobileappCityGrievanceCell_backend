const express = require('express');
const router = express.Router();
const {
  createPayment,
  getRecentPayments,
  getPaymentHistory,
  payBill
} = require('../controllers/payment.controller');

router.post('/create', createPayment);

// GET /api/payments/recent → Recent 5 payments
router.get('/recent', getRecentPayments);

// GET /api/payments/history → Full history
router.get('/history', getPaymentHistory);

// POST /api/bill/pay → Simulated payment
router.post('/bill/pay', payBill);

module.exports = router;
