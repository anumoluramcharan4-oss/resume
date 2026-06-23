// ==========================================
// models/ResumeShare.js — Public Resume Sharing
// ==========================================
// Manages links generated for external view.

const mongoose = require("mongoose");

const resumeShareSchema = new mongoose.Schema(
  {
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shareId: {
      type: String,
      required: true,
      unique: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null, // null means never expires
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    downloadsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ResumeShare", resumeShareSchema);
