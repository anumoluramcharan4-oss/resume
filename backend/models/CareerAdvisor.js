// ==========================================
// models/CareerAdvisor.js — Career Advisor Schema
// ==========================================
// Stores Career Advisor data for a user including goals, recommendations,
// roadmaps, skill gaps, projects, certifications, and AI coach chat history.

const mongoose = require("mongoose");

const careerAdvisorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    targetRole: {
      type: String,
      default: "",
    },
    preferences: {
      interests: { type: [String], default: [] },
      preferredLocation: { type: String, default: "" },
      desiredSalary: { type: String, default: "" },
      workType: {
        type: String,
        enum: ["Remote", "Hybrid", "On-site", ""],
        default: "Remote",
      },
    },
    recommendations: [
      {
        careerPath: { type: String, required: true },
        matchPercentage: { type: Number, required: true },
        whyItMatches: { type: String, default: "" },
        requiredSkills: { type: [String], default: [] },
        missingSkills: { type: [String], default: [] },
        expectedGrowth: { type: String, default: "" },
        difficultyLevel: { type: String, default: "" },
        salaryRange: { type: String, default: "" },
        learningTimeline: { type: String, default: "" },
      },
    ],
    skillAnalysis: {
      currentSkills: { type: [String], default: [] },
      missingSkills: [
        {
          name: { type: String, required: true },
          priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
          reason: { type: String, default: "" },
        },
      ],
      completionPercentage: { type: Number, default: 0 },
    },
    learningRoadmap: [
      {
        phaseName: { type: String, required: true },
        description: { type: String, default: "" },
        skills: [
          {
            name: { type: String, required: true },
            estimatedTime: { type: String, default: "" },
            resources: { type: [String], default: [] },
            difficulty: { type: String, default: "intermediate" },
            completed: { type: Boolean, default: false },
          },
        ],
      },
    ],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        difficulty: { type: String, default: "intermediate" },
        technologies: { type: [String], default: [] },
        learningOutcome: { type: [String], default: [] },
        resumeImpact: { type: String, default: "" },
        completed: { type: Boolean, default: false },
      },
    ],
    certifications: [
      {
        name: { type: String, required: true },
        provider: { type: String, default: "" },
        duration: { type: String, default: "" },
        difficulty: { type: String, default: "intermediate" },
        benefits: { type: String, default: "" },
        completed: { type: Boolean, default: false },
      },
    ],
    tracker: {
      skillsCompleted: { type: Number, default: 0 },
      projectsCompleted: { type: Number, default: 0 },
      certificationsEarned: { type: Number, default: 0 },
      resumeStrength: { type: Number, default: 0 },
      atsScore: { type: Number, default: 0 },
      interviewReadiness: { type: Number, default: 0 },
    },
    chatHistory: [
      {
        sender: { type: String, enum: ["user", "ai"], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CareerAdvisor", careerAdvisorSchema);
