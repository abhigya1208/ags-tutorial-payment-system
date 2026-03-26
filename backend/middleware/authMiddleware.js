// ─────────────────────────────────────────────────────────────
//  middleware/authMiddleware.js  –  JWT authentication guard
// ─────────────────────────────────────────────────────────────
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // Expect header:  Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorised – no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded payload to the request for downstream use
    req.admin = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorised – invalid token" });
  }
};

module.exports = { protect };
