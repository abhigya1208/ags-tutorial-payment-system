const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const generateToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required" });
  }

  try {
    const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(admin._id, admin.username);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const seedAdmin = async (req, res) => {
  try {
    const existing = await Admin.findOne({ username: "admin.ags@edu" });
    if (existing) {
      return res.status(200).json({ success: true, message: "Admin already exists" });
    }

    await Admin.create({ username: "admin.ags@edu", password: "Abhigya@1208" });

    return res.status(201).json({ success: true, message: "Admin account created successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ──────────────────────────────────────────────────────────
//  PUT /api/admin/change-password
//  Body: { oldPassword, newPassword }
//  Requires JWT (admin logged in)
// ──────────────────────────────────────────────────────────
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const adminId = req.admin.id; // from JWT middleware

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Old and new password are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
  }

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const isMatch = await admin.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Old password is incorrect" });
    }

    admin.password = newPassword;
    await admin.save();

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { loginAdmin, seedAdmin, changePassword };