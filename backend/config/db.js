// ─────────────────────────────────────────────────────────────
//  config/db.js  –  MongoDB connection via Mongoose
// ─────────────────────────────────────────────────────────────
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options silence deprecation warnings in Mongoose 7+
      // (they are the new defaults, but listed for clarity)
    });
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌  MongoDB connection error:", error.message);
    // Exit the process so the server doesn't run without a database
    process.exit(1);
  }
};

module.exports = connectDB;
