// ==========================================
// routes/advisor.js — Career Advisor Routes
// ==========================================
// Defines routing path for Career Advisor dashboard features.

const express = require("express");
const router = express.Router();
const {
  getAdvisorProfile,
  initializeAdvisor,
  updatePreferences,
  toggleSkill,
  toggleProject,
  toggleCertification,
  chatWithCoach,
} = require("../controllers/advisorController");
const { protect } = require("../middleware/auth");

// All advisor routes require authentication
router.use(protect);

router.get("/profile", getAdvisorProfile);
router.post("/initialize", initializeAdvisor);
router.put("/preferences", updatePreferences);
router.post("/toggle-skill", toggleSkill);
router.post("/toggle-project", toggleProject);
router.post("/toggle-certification", toggleCertification);
router.post("/chat", chatWithCoach);

module.exports = router;
