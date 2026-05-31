// ==========================================
// routes/jobs.js — Job Routes
// ==========================================

const express = require("express");
const router = express.Router();
const { saveJob, getSavedJobs, unsaveJob } = require("../controllers/jobController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.route("/saved").get(getSavedJobs).post(saveJob);
router.delete("/saved/:id", unsaveJob);

module.exports = router;
