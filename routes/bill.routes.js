const express = require('express');
const router = express.Router();
const {
  getBillByCategory,
  getBillersByCategory,
  fetchBillDetails,
  getBillDetailsById
} = require('../controllers/bill.controller');

router.get('/billers', getBillersByCategory);
router.post('/fetch', fetchBillDetails);
router.get('/details/:billId', getBillDetailsById);
router.get('/:category', getBillByCategory);

module.exports = router;

