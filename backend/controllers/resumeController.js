// ==========================================
// controllers/resumeController.js — Resume CRUD
// ==========================================
// Create, Read, Update, Delete operations for resumes.

const Resume = require("../models/Resume");

// ==========================================
// @route   GET /api/resumes
// @desc    Get all resumes for logged-in user
// @access  Private
// ==========================================
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({
      updatedAt: -1,
    });
    res.json({ resumes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching resumes" });
  }
};

// ==========================================
// @route   GET /api/resumes/:id
// @desc    Get a single resume by ID
// @access  Private
// ==========================================
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id, // Ensure user can only access their own resumes
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({ resume });
  } catch (error) {
    res.status(500).json({ message: "Error fetching resume" });
  }
};

// ==========================================
// @route   POST /api/resumes
// @desc    Create a new resume
// @access  Private
// ==========================================
const createResume = async (req, res) => {
  try {
    const resumeData = {
      ...req.body,
      user: req.user._id,
    };

    const resume = await Resume.create(resumeData);
    res.status(201).json({ message: "Resume created!", resume });
  } catch (error) {
    console.error("Create resume error:", error);
    res.status(500).json({ message: "Error creating resume" });
  }
};

// ==========================================
// @route   PUT /api/resumes/:id
// @desc    Update a resume
// @access  Private
// ==========================================
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({ message: "Resume updated!", resume });
  } catch (error) {
    res.status(500).json({ message: "Error updating resume" });
  }
};

// ==========================================
// @route   DELETE /api/resumes/:id
// @desc    Delete a resume
// @access  Private
// ==========================================
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting resume" });
  }
};

module.exports = {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
};
