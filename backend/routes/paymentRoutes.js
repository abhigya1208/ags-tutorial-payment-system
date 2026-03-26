// ─────────────────────────────────────────────────────────────
//  routes/paymentRoutes.js
// ─────────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controllers/paymentController");

// POST /api/payment/create-order  – create a Razorpay order
router.post("/create-order", createOrder);

// POST /api/payment/verify        – verify payment after checkout
router.post("/verify", verifyPayment);

module.exports = router;
