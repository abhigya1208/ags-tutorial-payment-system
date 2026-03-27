// ─────────────────────────────────────────────────────────────
//  controllers/adminController.js  –  Admin dashboard data
// ─────────────────────────────────────────────────────────────
const Payment = require("../models/Payment");

// ── Get all paid payments (LIFO) ──────────────────────────
const getAllPayments = async (req, res) => {
  try {
    // Fetch only "paid" payments, newest first
    const payments = await Payment.find({ status: "paid" }).sort({
      createdAt: -1,
    });

    // Calculate total collection
    const total = payments.reduce((sum, p) => sum + p.amount, 0);

    return res.status(200).json({
      success: true,
      count: payments.length,
      totalCollection: total,
      payments, // This now includes studentName and mobileNumber
    });
  } catch (error) {
    console.error("Get payments error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    return res.status(200).json({ success: true, payment });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getAllPayments, getPaymentById };