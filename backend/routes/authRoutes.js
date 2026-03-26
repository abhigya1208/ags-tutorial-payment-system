// ─────────────────────────────────────────────────────────────
//  routes/authRoutes.js
// ─────────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const { loginAdmin, seedAdmin } = require("../controllers/authController");

// POST /api/auth/login  – admin login
router.post("/login", loginAdmin);

// POST /api/auth/seed   – create default admin (run once)
router.post("/seed", seedAdmin);

module.exports = router;