// ─────────────────────────────────────────────────────────────
//  models/Payment.js  –  Mongoose schema for fee payments
// ─────────────────────────────────────────────────────────────
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // ── Student details ─────────────────────────────────────
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^\d{10}$/, "Mobile number must be exactly 10 digits"],
    },
    studentClass: {
      type: String,
      required: [true, "Class is required"],
      enum: ["8", "9", "10", "11", "12"],
    },

    // ── Payment details ─────────────────────────────────────
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [400, "Minimum payment amount is ₹400"],
    },
    // Amount in paise (amount × 100) – stored for reference
    amountInPaise: {
      type: Number,
      required: true,
    },

    // ── Razorpay IDs ────────────────────────────────────────
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },

    // ── Status ──────────────────────────────────────────────
    // "created"  – order created, payment not attempted yet
    // "paid"     – payment verified successfully
    // "failed"   – payment failed or signature mismatch
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
