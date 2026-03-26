// ─────────────────────────────────────────────────────────────
//  routes/adminRoutes.js  –  Protected admin routes
// ─────────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const { getAllPayments, getPaymentById } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

// All routes below require a valid JWT  ↓
// GET /api/admin/payments       – list all paid payments
router.get("/payments", protect, getAllPayments);

// GET /api/admin/payments/:id   – single payment detail
router.get("/payments/:id", protect, getPaymentById);

module.exports = router;
