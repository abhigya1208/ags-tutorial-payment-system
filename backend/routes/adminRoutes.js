const express = require("express");
const router = express.Router();

const { loginAdmin, seedAdmin, changePassword } = require("../controllers/authController");
const { getAllPayments, getPaymentById } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

// ── Public routes ──────────────────────────────
// POST /api/admin/login
router.post("/login", loginAdmin);

// POST /api/auth/seed  → temporary admin creation (if needed)
// Agar tumne pehle seed route server.js me add kiya tha, use hata sakte ho
router.post("/seed", seedAdmin);

// ── Protected routes (JWT required) ────────────
// PUT /api/admin/change-password
router.put("/change-password", protect, changePassword);

// GET /api/admin/payments
router.get("/payments", protect, getAllPayments);

// GET /api/admin/payments/:id
router.get("/payments/:id", protect, getPaymentById);

module.exports = router;