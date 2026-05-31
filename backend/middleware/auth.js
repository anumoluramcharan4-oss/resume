// ==========================================
// middleware/auth.js — JWT Authentication Middleware
// ==========================================
// This middleware "protects" routes.
// If a user tries to access a protected route without logging in,
// this will block the request and return a 401 Unauthorized error.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header has a Bearer token
  // Format: "Authorization: Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract just the token part (after "Bearer ")
      token = req.headers.authorization.split(" ")[1];

      // Verify the token is valid and not expired
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user info to the request object (without password)
      req.user = await User.findById(decoded.id).select("-password");

      // Move to the next middleware / route handler
      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
