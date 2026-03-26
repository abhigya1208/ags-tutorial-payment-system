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

// ── TEMPORARY DIRECT SEED ROUTE ──────────────────────────
app.post('/api/auth/seed', async (req, res) => {
  try {
    const Admin = require('./models/Admin');
    const existing = await Admin.findOne({ username: 'admin.ags@edu' });
    if (existing) {
      return res.json({ success: true, message: 'Admin already exists' });
    }
    await Admin.create({ username: 'admin.ags@edu', password: 'Abhigya@1208' });
    res.json({ success: true, message: 'Admin created successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
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
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
});

// ── Start server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅  AGS Tutorial server running on port ${PORT}`);
});