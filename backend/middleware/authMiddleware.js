// =============================================
// middleware/authMiddleware.js - JWT Token Verification
// =============================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// This middleware protects routes that require authentication.
// It reads the JWT from the Authorization header, verifies it,
// and attaches the user object to req.user for use in controllers.

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token (format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to the request (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next(); // Proceed to the actual route handler
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
