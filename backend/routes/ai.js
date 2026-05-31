// ==========================================
// routes/ai.js — AI Feature Routes
// ==========================================

const express = require("express");
const router = express.Router();
const {
  improveText,
  generateSummary,
  getAtsScore,
  suggestSkills,
  suggestProjects,
  suggestJobs,
  analyzeWeakness,
  rewriteProject,
  matchJob,
  optimizeResumeForJob,
} = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

// All AI routes require authentication
router.use(protect);

router.post("/improve-text", improveText);
router.post("/generate-summary", generateSummary);
router.post("/ats-score", getAtsScore);
router.post("/suggest-skills", suggestSkills);
router.post("/suggest-projects", suggestProjects);
router.post("/suggest-jobs", suggestJobs);
router.post("/analyze-weakness", analyzeWeakness);
router.post("/rewrite-project", rewriteProject);
router.post("/match-job", matchJob);
router.post("/optimize-resume-for-job", optimizeResumeForJob);

module.exports = router;
