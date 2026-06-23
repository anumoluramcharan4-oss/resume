// ==========================================
// models/ResumeVersion.js — Resume Version History
// ==========================================
// Stores historic snapshots of a user's resume.

const mongoose = require("mongoose");

const resumeVersionSchema = new mongoose.Schema(
  {
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      default: "My Resume",
    },
    template: {
      type: String,
      default: "modern",
    },
    personal: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      portfolio: String,
      twitter: String,
      role: String,
    },
    about: String,
    skills: Array,
    education: Array,
    experience: Array,
    projects: Array,
    certifications: Array,
    achievements: Array,
    languages: Array,
    atsScore: Number,
    aiAnalysis: mongoose.Schema.Types.Mixed,
    originalPdfData: String,
    originalPdfName: String,
    rawText: String,
    careerReadinessScore: Number,
    recommendedInternships: Array,
    recommendedCareerPaths: Array,
    changesDetected: Array,
  },
  {
    timestamps: true,
  }
);

// Index to search versions for a specific resume quickly
resumeVersionSchema.index({ resume: 1, version: -1 });

module.exports = mongoose.model("ResumeVersion", resumeVersionSchema);
