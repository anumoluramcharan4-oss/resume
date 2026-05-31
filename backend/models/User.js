// ==========================================
// models/User.js — User Database Schema
// ==========================================
// This defines what a "User" looks like in our database.
// Every user who registers will have this structure.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // No two users can have the same email
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    // Profile information
    profilePicture: {
      type: String,
      default: "",
    },
    headline: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    // Career goals
    targetRole: {
      type: String,
      default: "",
    },
    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior", ""],
      default: "",
    },
    // Saved jobs list (references to SavedJob collection)
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SavedJob",
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Hash password before saving to database
// This runs automatically before every .save() call
userSchema.pre("save", async function (next) {
  // Only hash if the password field was changed
  if (!this.isModified("password")) return next();

  // bcrypt salt rounds — higher = more secure but slower (10 is a good balance)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
