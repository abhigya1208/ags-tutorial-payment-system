// ─────────────────────────────────────────────────────────────
//  routes/adminRoutes.js  –  Protected admin routes
// ─────────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const { getAllPayments, getPaymentById } = require("../controllers/adminController");
const { loginAdmin, changePassword } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// ── Public routes (no authentication required) ────────────
// POST /api/admin/login – admin login
router.post("/login", loginAdmin);

// ── Protected routes (JWT required) ───────────────────────
// PUT /api/admin/change-password – change admin password
router.put("/change-password", protect, changePassword);

// GET /api/admin/payments       – list all paid payments
router.get("/payments", protect, getAllPayments);

// GET /api/admin/payments/:id   – single payment detail
router.get("/payments/:id", protect, getPaymentById);

module.exports = router;