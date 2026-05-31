// ==========================================
// routes/auth.js — Authentication Routes
// ==========================================

const express = require("express");
const router = express.Router();
const { register, login, getMe, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Public routes (no token needed)
router.post("/register", register);
router.post("/login", login);

// Protected routes (token required)
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

module.exports = router;
