// ─────────────────────────────────────────────────────────────
//  server.js  –  AGS Tutorial main Express server
// ─────────────────────────────────────────────────────────────
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// ── Route imports ──────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ── Connect to MongoDB ─────────────────────────────────────
connectDB();

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ───────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "AGS Tutorial API is running 🚀" });
});

// ── Routes ─────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// ── 404 handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global error handler ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(500)
    .json({ success: false, message: err.message || "Internal server error" });
});

// ── Start server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅  AGS Tutorial server running on port ${PORT}`);
});

// Test payment route
app.post('/api/payment/create-order', (req, res) => {
  res.json({ success: true, message: 'Test route working' });
});
