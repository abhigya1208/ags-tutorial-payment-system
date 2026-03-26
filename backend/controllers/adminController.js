// ─────────────────────────────────────────────────────────────
//  controllers/adminController.js  –  Admin dashboard data
// ─────────────────────────────────────────────────────────────
const Payment = require("../models/Payment");

// ──────────────────────────────────────────────────────────
//  GET /api/admin/payments
//  Returns all *paid* payments in LIFO order + total amount
// ──────────────────────────────────────────────────────────
const getAllPayments = async (req, res) => {
  try {
    // Sort by createdAt descending (newest first – LIFO)
    const payments = await Payment.find({ status: "paid" }).sort({
      createdAt: -1,
    });

    // Calculate total collection from paid payments
    const total = payments.reduce((sum, p) => sum + p.amount, 0);

    return res.status(200).json({
      success: true,
      count: payments.length,
      totalCollection: total,
      payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ──────────────────────────────────────────────────────────
//  GET /api/admin/payments/:id
//  Returns a single payment by its MongoDB _id
// ──────────────────────────────────────────────────────────
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }
    return res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error("Get payment by ID error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getAllPayments, getPaymentById };
