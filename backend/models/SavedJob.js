// ==========================================
// models/SavedJob.js — Saved Job Schema
// ==========================================
// When a user saves a job/internship, it's stored here.

const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["job", "internship"],
      default: "job",
    },
    location: {
      type: String,
      default: "Remote",
    },
    requiredSkills: [String],
    applyUrl: {
      type: String,
      default: "#",
    },
    salary: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    matchScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SavedJob", savedJobSchema);
