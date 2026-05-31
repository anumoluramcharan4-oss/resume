// ==========================================
// controllers/jobController.js — Jobs & Saved Jobs
// ==========================================

const SavedJob = require("../models/SavedJob");
const User = require("../models/User");

// Save a job
const saveJob = async (req, res) => {
  try {
    const jobData = { ...req.body, user: req.user._id };
    const job = await SavedJob.create(jobData);

    // Add reference to user's savedJobs array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { savedJobs: job._id },
    });

    res.status(201).json({ message: "Job saved!", job });
  } catch (error) {
    res.status(500).json({ message: "Error saving job" });
  }
};

// Get all saved jobs for current user
const getSavedJobs = async (req, res) => {
  try {
    const jobs = await SavedJob.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved jobs" });
  }
};

// Delete a saved job
const unsaveJob = async (req, res) => {
  try {
    const job = await SavedJob.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { savedJobs: req.params.id },
    });

    res.json({ message: "Job removed from saved list" });
  } catch (error) {
    res.status(500).json({ message: "Error removing job" });
  }
};

module.exports = { saveJob, getSavedJobs, unsaveJob };
