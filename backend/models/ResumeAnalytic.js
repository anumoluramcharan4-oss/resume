// ==========================================
// models/ResumeAnalytic.js — Resume Analytics Log
// ==========================================
// Records individual page view and download events.

const mongoose = require("mongoose");

const resumeAnalyticSchema = new mongoose.Schema(
  {
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    share: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResumeShare",
      default: null,
    },
    action: {
      type: String,
      enum: ["view", "download"],
      required: true,
    },
    ip: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
    },
    referrer: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ResumeAnalytic", resumeAnalyticSchema);
