const Payment = require('../models/payment.model');
const Bill = require('../models/bill.model');
const { v4: uuidv4 } = require('uuid');


exports.createPayment = async (req, res) => {
  try {
    const { user, type, amount, details } = req.body;
    if (!user || !type || !amount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const payment = new Payment({
      user,
      type,
      amount,
      details,
      status: 'success',
      paidAt: new Date()
    });

    await payment.save();

    res.status(201).json({ success: true, payment });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get recent 5 payments for a user
exports.getRecentPayments = async (req, res) => {
  try {
    const userId = req.body.user || req.user?.id; // adjust this based on auth

    const payments = await Payment.find({ user: userId })
      .sort({ paidAt: -1 })
      .limit(5)
      .populate('bill');

    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching recent payments', error });
  }
};

// Get full payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.body.user || req.user?.id;

    const payments = await Payment.find({ user: userId })
      .sort({ paidAt: -1 })
      .populate('bill');

    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching payment history', error });
  }
};

// Pay a bill (simulate)
exports.payBill = async (req, res) => {
  try {
    const { billId, user } = req.body;

    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ success: false, message: 'Bill not found' });

    // Simulate payment success
    const transaction = new Payment({
      user,
      bill: bill._id,
      category: bill.category,
      amount: bill.amount,
      transactionId: uuidv4(),
      status: 'Success',
    });

    await transaction.save();

    // Update bill status
    bill.status = 'Paid';
    await bill.save();

    res.status(200).json({
      success: true,
      message: 'Bill paid successfully',
      transactionId: transaction.transactionId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment failed', error });
  }
};
