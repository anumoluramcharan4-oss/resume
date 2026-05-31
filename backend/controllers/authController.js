// ==========================================
// controllers/authController.js — Authentication Logic
// ==========================================
// Handles user registration, login, and profile operations.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper: Generate a JWT token for a user
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// ==========================================
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// ==========================================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Create new user (password is hashed automatically by the model)
    const user = await User.create({ name, email, password });

    // Return user data + token
    res.status(201).json({
      message: "Registration successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ==========================================
// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
// ==========================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        headline: user.headline,
        location: user.location,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ==========================================
// @route   GET /api/auth/me
// @desc    Get current logged-in user profile
// @access  Private (requires token)
// ==========================================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
// ==========================================
const updateProfile = async (req, res) => {
  try {
    const { name, headline, location, website, phone, targetRole, experienceLevel } =
      req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, headline, location, website, phone, targetRole, experienceLevel },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, getMe, updateProfile };
