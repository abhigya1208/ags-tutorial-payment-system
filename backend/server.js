// ─────────────────────────────────────────────────────────────
// server.js – Main entry point
// ─────────────────────────────────────────────────────────────

// ── Load environment variables ─────────────────────────────
require("dotenv").config();

// ── Imports ───────────────────────────────────────────────
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// ── Route imports ─────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ── Initialize Express app ───────────────────────────────
const app = express();

// ── Connect to MongoDB ───────────────────────────────────
connectDB();

// ── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://ags-tutorial-frontend.onrender.com"
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "AGS Tutorial API is running 🚀" });
});

// ── Routes ───────────────────────────────────────────────
app.use("/api/auth", authRoutes);      // login, seed
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);    // admin protected routes

// ── 404 handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global error handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
});

// ── Start server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ AGS Tutorial server running on port ${PORT}`);
});