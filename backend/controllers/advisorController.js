// ==========================================
// controllers/advisorController.js — AI Advisor Logic
// ==========================================
// Handles Career recommendations, Skill analysis, Roadmap generation,
// Progress tracking, and AI Coach chats using Gemini API.

const aiClient = require("../config/aiClient");
const CareerAdvisor = require("../models/CareerAdvisor");
const Resume = require("../models/Resume");
const User = require("../models/User");

// Helper: Get the OpenRouter model client
const getModel = () => aiClient;

// Safe JSON Parsing from Gemini response
const parseJSON = (text) => {
  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON parsing error:", err, "Raw Text:", text);
    throw new Error("Failed to parse AI response. Raw response: " + text);
  }
};

// Helper to recalculate progress scores
const recalculateTracker = (advisor, latestResume) => {
  const totalSkills = advisor.learningRoadmap.reduce((acc, phase) => acc + (phase.skills?.length || 0), 0);
  const completedSkills = advisor.learningRoadmap.reduce((acc, phase) => acc + (phase.skills?.filter(s => s.completed)?.length || 0), 0);
  
  const totalProjects = advisor.projects.length;
  const completedProjects = advisor.projects.filter(p => p.completed).length;

  const totalCerts = advisor.certifications.length;
  const completedCerts = advisor.certifications.filter(c => c.completed).length;

  // 1. Skill progress percentage
  const skillPercentage = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;
  advisor.skillAnalysis.completionPercentage = skillPercentage;

  // 2. Tracker updates
  advisor.tracker.skillsCompleted = completedSkills;
  advisor.tracker.projectsCompleted = completedProjects;
  advisor.tracker.certificationsEarned = completedCerts;

  // 3. ATS score from latest resume
  advisor.tracker.atsScore = latestResume?.atsScore || 0;

  // 4. Resume strength calculation
  let resumeStrength = 20; // Base strength
  if (latestResume) {
    if (latestResume.personal?.email) resumeStrength += 5;
    if (latestResume.personal?.linkedin || latestResume.personal?.github) resumeStrength += 5;
    if (latestResume.about) resumeStrength += 5;
    if (latestResume.experience?.length > 0) resumeStrength += 15;
    if (latestResume.education?.length > 0) resumeStrength += 10;
  }
  // Bonus from completed projects and certs
  resumeStrength += completedProjects * 10;
  resumeStrength += completedCerts * 10;
  advisor.tracker.resumeStrength = Math.min(100, resumeStrength);

  // 5. Interview Readiness
  let interviewReadiness = 30; // Base readiness
  interviewReadiness += Math.round(skillPercentage * 0.4); // up to +40%
  interviewReadiness += completedProjects * 10; // up to +20%
  interviewReadiness += completedCerts * 5; // up to +10%
  advisor.tracker.interviewReadiness = Math.min(100, interviewReadiness);
};

// ==========================================
// @route   GET /api/advisor/profile
// @desc    Get or inspect advisor profile
// ==========================================
const getAdvisorProfile = async (req, res) => {
  try {
    let advisor = await CareerAdvisor.findOne({ user: req.user._id });
    const latestResume = await Resume.findOne({ user: req.user._id }).sort({ updatedAt: -1 });

    if (!advisor) {
      // Return details for onboarding wizard setup
      return res.json({
        advisor: null,
        hasResume: !!latestResume,
        resumeSkills: latestResume ? latestResume.skills.map((s) => s.name) : [],
        targetRole: latestResume ? latestResume.title : req.user.targetRole || "",
      });
    }

    // Refresh atsScore if a newer resume analysis was done
    if (latestResume && latestResume.atsScore && latestResume.atsScore !== advisor.tracker.atsScore) {
      advisor.tracker.atsScore = latestResume.atsScore;
      await advisor.save();
    }

    res.json({ advisor });
  } catch (error) {
    console.error("Get advisor profile error:", error);
    res.status(500).json({ message: "Error fetching advisor profile" });
  }
};

// ==========================================
// @route   POST /api/advisor/initialize
// @desc    Generate career plan & recommendations via Gemini AI
// ==========================================
const initializeAdvisor = async (req, res) => {
  try {
    const { targetRole, preferences, manualSkills } = req.body;
    const { interests, preferredLocation, desiredSalary, workType } = preferences || {};

    const latestResume = await Resume.findOne({ user: req.user._id }).sort({ updatedAt: -1 });

    // Gather candidate parameters
    let skills = manualSkills || [];
    if (skills.length === 0 && latestResume) {
      skills = latestResume.skills.map((s) => s.name);
    }
    if (skills.length === 0) {
      skills = ["HTML", "CSS", "JavaScript"]; // Default fallback
    }

    const experienceSummary = latestResume ? latestResume.experience.map(e => ({
      role: e.role,
      company: e.company,
      description: e.description
    })) : "None";

    const projectsSummary = latestResume ? latestResume.projects.map(p => ({
      name: p.name,
      technologies: p.technologies
    })) : [];

    const certificationsSummary = latestResume ? latestResume.certifications.map(c => c.name) : [];

    // Trigger Gemini
    const model = getModel();
    const prompt = `You are a premium AI Career Coach and Recruiter. Analyze the following candidate profile:
Target Role Selected: ${targetRole}
Current Skills: ${skills.join(", ")}
Interests: ${interests?.join(", ") || "None"}
Preferred Location: ${preferredLocation || "Not specified"}
Desired Salary: ${desiredSalary || "Not specified"}
Preferred Work Type: ${workType || "Remote"}
Experience Details: ${JSON.stringify(experienceSummary)}
Existing Projects: ${JSON.stringify(projectsSummary)}
Existing Certifications: ${JSON.stringify(certificationsSummary)}
${latestResume && latestResume.rawText ? `Raw Resume Text:\n${latestResume.rawText}\n` : ""}
Provide an intelligent, personalized career strategy in JSON. Do NOT output any markdown tags outside the JSON block. Respond in this exact format:
{
  "recommendations": [
    {
      "careerPath": "e.g. Frontend Developer",
      "matchPercentage": 85,
      "whyItMatches": "Why this path matches current skills & interests.",
      "requiredSkills": ["React", "TypeScript", "Docker"],
      "missingSkills": ["TypeScript", "Docker"],
      "expectedGrowth": "High (e.g. 18% YoY)",
      "difficultyLevel": "Medium/High",
      "salaryRange": "$80,000 - $130,000",
      "learningTimeline": "3-4 months"
    }
  ],
  "skillAnalysis": {
    "currentSkills": ["React", "JavaScript"],
    "missingSkills": [
      { "name": "TypeScript", "priority": "high", "reason": "Required for large-scale production." }
    ],
    "completionPercentage": 50
  },
  "learningRoadmap": [
    {
      "phaseName": "Phase 1: Tooling",
      "description": "Master core languages and development tools.",
      "skills": [
        {
          "name": "TypeScript",
          "estimatedTime": "2 weeks",
          "resources": ["https://typescriptlang.org", "Learn TypeScript - YouTube"],
          "difficulty": "intermediate"
        }
      ]
    }
  ],
  "projects": [
    {
      "title": "E-Commerce App",
      "description": "Full-featured shopping platform.",
      "difficulty": "advanced",
      "technologies": ["React", "TypeScript"],
      "learningOutcome": ["API Integration", "State Management"],
      "resumeImpact": "Adds enterprise-level work to resume."
    }
  ],
  "certifications": [
    {
      "name": "AWS Certified Developer",
      "provider": "Amazon",
      "duration": "6 weeks",
      "difficulty": "advanced",
      "benefits": "Validates cloud skills."
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const resultText = result.response.text();
    const data = parseJSON(resultText);

    // Find or create advisor profile
    let advisor = await CareerAdvisor.findOne({ user: req.user._id });
    if (!advisor) {
      advisor = new CareerAdvisor({ user: req.user._id });
    }

    advisor.targetRole = targetRole;
    advisor.preferences = {
      interests: interests || [],
      preferredLocation: preferredLocation || "",
      desiredSalary: desiredSalary || "",
      workType: workType || "Remote",
    };
    advisor.recommendations = data.recommendations;
    advisor.skillAnalysis = {
      currentSkills: data.skillAnalysis.currentSkills,
      missingSkills: data.skillAnalysis.missingSkills.map(s => ({
        name: s.name,
        priority: s.priority,
        reason: s.reason
      })),
      completionPercentage: data.skillAnalysis.completionPercentage
    };
    
    // Build learning roadmap
    advisor.learningRoadmap = data.learningRoadmap.map(phase => ({
      phaseName: phase.phaseName,
      description: phase.description,
      skills: phase.skills.map(s => ({
        name: s.name,
        estimatedTime: s.estimatedTime,
        resources: s.resources,
        difficulty: s.difficulty,
        completed: false
      }))
    }));

    // Build projects
    advisor.projects = data.projects.map(p => ({
      title: p.title,
      description: p.description,
      difficulty: p.difficulty,
      technologies: p.technologies,
      learningOutcome: p.learningOutcome,
      resumeImpact: p.resumeImpact,
      completed: false
    }));

    // Build certifications
    advisor.certifications = data.certifications.map(c => ({
      name: c.name,
      provider: c.provider,
      duration: c.duration,
      difficulty: c.difficulty,
      benefits: c.benefits,
      completed: false
    }));

    // Recalculate tracker scores
    recalculateTracker(advisor, latestResume);

    // Save advisor profile
    await advisor.save();

    res.json({ message: "Career Advisor initialized!", advisor });
  } catch (error) {
    console.error("Initialize Advisor error:", error);
    res.status(500).json({ message: error.message || "Failed to initialize career advisor" });
  }
};

// ==========================================
// @route   PUT /api/advisor/preferences
// @desc    Update career preferences
// ==========================================
const updatePreferences = async (req, res) => {
  try {
    const { targetRole, preferences } = req.body;
    const advisor = await CareerAdvisor.findOne({ user: req.user._id });
    if (!advisor) {
      return res.status(404).json({ message: "Advisor profile not found. Please initialize first." });
    }

    if (targetRole) advisor.targetRole = targetRole;
    if (preferences) {
      advisor.preferences = {
        ...advisor.preferences.toObject(),
        ...preferences
      };
    }

    await advisor.save();
    res.json({ message: "Preferences updated!", advisor });
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({ message: "Error updating preferences" });
  }
};

// ==========================================
// @route   POST /api/advisor/toggle-skill
// @desc    Toggle a roadmap skill completion state
// ==========================================
const toggleSkill = async (req, res) => {
  try {
    const { skillName } = req.body;
    const advisor = await CareerAdvisor.findOne({ user: req.user._id });
    if (!advisor) {
      return res.status(404).json({ message: "Advisor profile not found." });
    }

    let found = false;
    for (let phase of advisor.learningRoadmap) {
      for (let s of phase.skills) {
        if (s.name.toLowerCase() === skillName.toLowerCase()) {
          s.completed = !s.completed;
          found = true;
        }
      }
    }

    if (!found) {
      return res.status(404).json({ message: `Skill "${skillName}" not found in roadmap.` });
    }

    const latestResume = await Resume.findOne({ user: req.user._id }).sort({ updatedAt: -1 });
    recalculateTracker(advisor, latestResume);
    await advisor.save();

    res.json({ message: "Skill progress toggled!", advisor });
  } catch (error) {
    console.error("Toggle skill error:", error);
    res.status(500).json({ message: "Error toggling skill" });
  }
};

// ==========================================
// @route   POST /api/advisor/toggle-project
// @desc    Toggle a recommended project completion state
// ==========================================
const toggleProject = async (req, res) => {
  try {
    const { projectId } = req.body;
    const advisor = await CareerAdvisor.findOne({ user: req.user._id });
    if (!advisor) {
      return res.status(404).json({ message: "Advisor profile not found." });
    }

    const project = advisor.projects.id(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project recommendation not found." });
    }

    project.completed = !project.completed;

    const latestResume = await Resume.findOne({ user: req.user._id }).sort({ updatedAt: -1 });
    recalculateTracker(advisor, latestResume);
    await advisor.save();

    res.json({ message: "Project status toggled!", advisor });
  } catch (error) {
    console.error("Toggle project error:", error);
    res.status(500).json({ message: "Error toggling project" });
  }
};

// ==========================================
// @route   POST /api/advisor/toggle-certification
// @desc    Toggle a recommended certification completion state
// ==========================================
const toggleCertification = async (req, res) => {
  try {
    const { certificationId } = req.body;
    const advisor = await CareerAdvisor.findOne({ user: req.user._id });
    if (!advisor) {
      return res.status(404).json({ message: "Advisor profile not found." });
    }

    const certification = advisor.certifications.id(certificationId);
    if (!certification) {
      return res.status(404).json({ message: "Certification recommendation not found." });
    }

    certification.completed = !certification.completed;

    const latestResume = await Resume.findOne({ user: req.user._id }).sort({ updatedAt: -1 });
    recalculateTracker(advisor, latestResume);
    await advisor.save();

    res.json({ message: "Certification status toggled!", advisor });
  } catch (error) {
    console.error("Toggle certification error:", error);
    res.status(500).json({ message: "Error toggling certification" });
  }
};

// ==========================================
// @route   POST /api/advisor/chat
// @desc    Chat with the AI Career Coach
// ==========================================
const chatWithCoach = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    const advisor = await CareerAdvisor.findOne({ user: req.user._id });
    if (!advisor) {
      return res.status(404).json({ message: "Advisor profile not found. Please set up goals first." });
    }

    const latestResume = await Resume.findOne({ user: req.user._id }).sort({ updatedAt: -1 });

    // Save user message
    advisor.chatHistory.push({ sender: "user", text: message });

    // Prepare prompt with context
    const model = getModel();
    
    // Grab the latest 10 messages for chat context
    const recentHistory = advisor.chatHistory.slice(-10);
    const historyString = recentHistory
      .map((msg) => `${msg.sender === "user" ? "User" : "Coach"}: ${msg.text}`)
      .join("\n");

    const currentRoadmapSkills = advisor.learningRoadmap
      .reduce((arr, phase) => arr.concat(phase.skills.map((s) => `${s.name} (${s.completed ? "Completed" : "Pending"})`)), [])
      .join(", ");

    const contextPrompt = `You are "Coach Gemini", a friendly, highly encouraging personal AI Career Coach inside the CareerAI platform.
Your purpose is to provide personalized, specific, and actionable career guidance.

${latestResume && latestResume.rawText ? `Candidate's Resume Plain Text Content:\n${latestResume.rawText}\n\n` : ""}Candidate Profile Context:
- Target Role: ${advisor.targetRole}
- Current Skills: ${advisor.skillAnalysis.currentSkills.join(", ")}
- Missing Skills needed: ${advisor.skillAnalysis.missingSkills.map((s) => s.name).join(", ")}
- Interests: ${advisor.preferences.interests.join(", ")}
- Work Type Preference: ${advisor.preferences.workType}
- Target Salary Range: ${advisor.preferences.desiredSalary}
- Roadmap Progress: ${currentRoadmapSkills}

Here is the conversation history so far:
${historyString}

Please respond to the User. Keep your answer encouraging, brief, clear, and action-oriented. Format your response cleanly using markdown. Avoid long generic lists; instead, reference their specific skills and goal (${advisor.targetRole}) directly.`;

    const result = await model.generateContent(contextPrompt);
    const responseText = result.response.text().trim();

    // Save AI message
    advisor.chatHistory.push({ sender: "ai", text: responseText });
    await advisor.save();

    res.json({ response: responseText, chatHistory: advisor.chatHistory });
  } catch (error) {
    console.error("AI Coach Chat error:", error);
    res.status(500).json({ message: "Error communicating with AI coach" });
  }
};

module.exports = {
  getAdvisorProfile,
  initializeAdvisor,
  updatePreferences,
  toggleSkill,
  toggleProject,
  toggleCertification,
  chatWithCoach,
};
