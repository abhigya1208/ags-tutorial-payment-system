// ─────────────────────────────────────────────────────────────
//  controllers/authController.js  –  Admin login / seed
// ─────────────────────────────────────────────────────────────
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// ── Helper: generate a signed JWT ─────────────────────────
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "8h", // session expires after 8 hours
  });
};

// ──────────────────────────────────────────────────────────
//  POST /api/auth/login
//  Body: { email, password }
// ──────────────────────────────────────────────────────────
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  try {
    // Look up admin in DB
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check password using the model's instance method
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate token and return
    const token = generateToken(admin._id, admin.email);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ──────────────────────────────────────────────────────────
//  POST /api/auth/seed
//  Creates the default admin account if it doesn't exist.
//  Call this once after first deployment.
// ──────────────────────────────────────────────────────────
const seedAdmin = async (req, res) => {
  try {
    const existing = await Admin.findOne({ email: "admin@ags.com" });
    if (existing) {
      return res
        .status(200)
        .json({ success: true, message: "Admin already exists" });
    }

    await Admin.create({ email: "admin@ags.com", password: "Admin@123" });

    return res
      .status(201)
      .json({ success: true, message: "Admin account created successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { loginAdmin, seedAdmin };
