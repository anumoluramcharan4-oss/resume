// ==========================================
// models/Resume.js — Resume Database Schema
// ==========================================
// Stores all resume data for a user.
// Supports multiple resumes per user, each with different sections.

const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    // Which user owns this resume
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Resume title (e.g., "Software Engineer Resume")
    title: {
      type: String,
      default: "My Resume",
    },
    // Which template to use for rendering
    template: {
      type: String,
      enum: ["modern", "minimal", "professional", "ats-friendly"],
      default: "modern",
    },

    // --- Personal Details Section ---
    personal: {
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },

    // --- About / Summary Section ---
    about: {
      type: String,
      default: "",
    },

    // --- Skills Section ---
    skills: [
      {
        name: String,
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "expert"],
          default: "intermediate",
        },
      },
    ],

    // --- Education Section ---
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startDate: String,
        endDate: String,
        grade: String,
        description: String,
      },
    ],

    // --- Work Experience Section ---
    experience: [
      {
        company: String,
        role: String,
        location: String,
        startDate: String,
        endDate: String,
        current: { type: Boolean, default: false },
        description: String,
      },
    ],

    // --- Projects Section ---
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        liveUrl: String,
        githubUrl: String,
        startDate: String,
        endDate: String,
      },
    ],

    // --- Certifications Section ---
    certifications: [
      {
        name: String,
        issuer: String,
        date: String,
        url: String,
      },
    ],

    // --- Achievements Section ---
    achievements: [
      {
        title: String,
        description: String,
        date: String,
      },
    ],

    // --- Languages Section ---
    languages: [
      {
        name: String,
        proficiency: {
          type: String,
          enum: ["basic", "conversational", "fluent", "native"],
          default: "conversational",
        },
      },
    ],

    // ATS Score from last AI analysis
    atsScore: {
      type: Number,
      default: null,
    },

    // Last AI analysis summary (structured object)
    aiAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Archiving status
    isArchived: {
      type: Boolean,
      default: false,
    },

    // Resume completeness
    completionPercentage: {
      type: Number,
      default: 0,
    },

    // Overall Analytics
    viewsCount: {
      type: Number,
      default: 0,
    },

    downloadsCount: {
      type: Number,
      default: 0,
    },

    // --- PDF Storage & Extra AI Results ---
    originalPdfData: {
      type: String,
      default: null,
    },
    originalPdfName: {
      type: String,
      default: null,
    },
    careerReadinessScore: {
      type: Number,
      default: null,
    },
    recommendedInternships: {
      type: [String],
      default: [],
    },
    recommendedCareerPaths: {
      type: [String],
      default: [],
    },
    rawText: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
