const Bill = require('../models/bill.model');
const { v4: uuidv4 } = require('uuid');

// Predefined billers by category
const billersList = {
  electricity: ["TNEB", "BESCOM", "MSEB", "Adani"],
  water: ["Chennai Metro Water", "Delhi Jal Board", "Bangalore Water Supply"],
  gas: ["Indane", "HP Gas", "Bharat Gas"]
};

// 1. GET /api/bill/:category → all bills from MongoDB
exports.getBillByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const bills = await Bill.find({ category: category.toLowerCase() });

    if (bills.length === 0) {
      return res.status(404).json({ success: false, message: "No bills found for this category" });
    }

    res.status(200).json({ success: true, category, bills });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bills", error });
  }
};

// 2. GET /api/bill/billers?category=gas
exports.getBillersByCategory = (req, res) => {
  const category = req.query.category?.toLowerCase();

  if (!category || !billersList[category]) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  res.status(200).json({ success: true, category, billers: billersList[category] });
};

// 3. POST /api/bill/fetch → creates a bill entry in MongoDB
exports.fetchBillDetails = async (req, res) => {
  const { category, biller, consumerNumber } = req.body;

  if (!category || !biller || !consumerNumber) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const billId = "BILL-" + uuidv4().slice(0, 8).toUpperCase();

    const newBill = new Bill({
      billId,
      category,
      biller,
      consumerNumber,
      name: "Sundar Raj", // ✅ Replace this with real user data if needed
      amount: Math.floor(Math.random() * 500) + 250, // ₹250–750
      dueDate: "2025-07-15",
      status: "unpaid"
    });

    await newBill.save();

    res.status(200).json({ success: true, bill: newBill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to save bill", error });
  }
};

// 4. GET /api/bill/details/:billId
exports.getBillDetailsById = async (req, res) => {
  const { billId } = req.params;

  try {
    const bill = await Bill.findOne({ billId });
    if (!bill) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }

    res.status(200).json({ success: true, bill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bill", error });
  }
};
