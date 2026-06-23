// ==========================================
// routes/resume.js — Resume Routes
// ==========================================

const express = require("express");
const router = express.Router();
const {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  archiveResume,
  restoreResume,
  duplicateResume,
  shareResume,
  getShareSettings,
  getVersionHistory,
  restoreVersion,
  analyzeResume,
  trackExport,
  getPublicResume,
  importResume,
  importPdfResume,
  saveImportedResume,
  compareResumeVersions,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/auth");

// ---- PUBLIC ROUTES ----
// View a public share link (must bypass auth check)
router.get("/public/:shareId", getPublicResume);

// ---- PROTECTED ROUTES (require authorization) ----
router.use(protect);

router.route("/")
  .get(getResumes)
  .post(createResume);

router.post("/import", importResume);
router.post("/import-pdf", importPdfResume);
router.post("/import/save", saveImportedResume);
router.get("/:id/compare-versions", compareResumeVersions);

router.route("/:id")
  .get(getResumeById)
  .put(updateResume)
  .delete(deleteResume);

// Actions & Sub-Resources
router.post("/:id/archive", archiveResume);
router.post("/:id/restore", restoreResume);
router.post("/:id/duplicate", duplicateResume);

router.route("/:id/share")
  .get(getShareSettings)
  .post(shareResume);

router.get("/:id/versions", getVersionHistory);
router.post("/:id/versions/:versionId/restore", restoreVersion);

router.post("/:id/analyze", analyzeResume);
router.post("/:id/track-export", trackExport);

module.exports = router;
