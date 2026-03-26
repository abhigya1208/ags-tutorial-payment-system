const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

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

const seedAdmin = async (req, res) => {
  try {
    const existing = await Admin.findOne({ email: "admin@ags.com" });
    if (existing) {
      return res.status(200).json({ success: true, message: "Admin already exists" });
    }

    await Admin.create({ email: "admin@ags.com", password: "Admin@123" });

    return res.status(201).json({ success: true, message: "Admin account created successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { loginAdmin, seedAdmin };