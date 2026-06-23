// ==========================================
// controllers/aiController.js — Gemini AI Features
// ==========================================
// All AI-powered endpoints using Google Gemini API.
// Each endpoint sends a carefully crafted prompt to Gemini
// and returns structured results.

const aiClient = require("../config/aiClient");

// Helper: Get the OpenRouter model client
const getModel = () => aiClient;

// Helper: Safe JSON parse from Gemini response
const parseJSON = (text) => {
  try {
    // Remove markdown code blocks if present
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { raw: text };
  }
};

// ==========================================
// @route   POST /api/ai/improve-text
// @desc    Improve any resume text professionally
// @access  Private
// ==========================================
const improveText = async (req, res) => {
  try {
    const { text, context } = req.body;
    if (!text)
      return res.status(400).json({ message: "Text is required" });

    const model = getModel();
    const prompt = `You are a professional resume writer. Improve the following resume text to sound more professional, impactful, and ATS-friendly. Use strong action verbs. Keep it concise.

Context: ${context || "general resume content"}

Original text: "${text}"

Return only the improved text, nothing else.`;

    const result = await model.generateContent(prompt);
    const improved = result.response.text().trim();
    res.json({ improved });
  } catch (error) {
    console.error("AI improve-text error:", error);
    res.status(500).json({ message: "AI service error. Check your Gemini API key." });
  }
};

// ==========================================
// @route   POST /api/ai/generate-summary
// @desc    Generate a professional resume summary
// @access  Private
// ==========================================
const generateSummary = async (req, res) => {
  try {
    const { name, skills, experience, education, targetRole } = req.body;

    const model = getModel();
    const prompt = `Generate a professional, impactful resume summary (3-4 sentences) for a person with the following details:

Name: ${name || "The candidate"}
Target Role: ${targetRole || "Software Developer"}
Skills: ${skills?.join(", ") || "Not specified"}
Experience: ${experience || "Fresher"}
Education: ${education || "Engineering graduate"}

The summary should:
- Start with a strong opening about who they are
- Highlight key skills and achievements
- Show enthusiasm and career goals
- Be ATS-friendly
- Sound human and professional

Return only the summary paragraph.`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: "AI service error" });
  }
};

// ==========================================
// @route   POST /api/ai/ats-score
// @desc    Analyze resume and return ATS score
// @access  Private
// ==========================================
const getAtsScore = async (req, res) => {
  try {
    const { resume } = req.body;

    const model = getModel();
    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze this resume and provide a detailed ATS score.

Resume Data:
${JSON.stringify(resume, null, 2)}

Respond with a JSON object in this exact format:
{
  "score": <number 0-100>,
  "grade": "<A+/A/B/C/D>",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "sectionScores": {
    "contact": <0-100>,
    "summary": <0-100>,
    "skills": <0-100>,
    "experience": <0-100>,
    "education": <0-100>,
    "projects": <0-100>
  },
  "verdict": "<one line overall verdict>"
}`;

    const result = await model.generateContent(prompt);
    const parsed = parseJSON(result.response.text());
    res.json(parsed);
  } catch (error) {
    console.error("ATS score error:", error);
    res.status(500).json({ message: "AI service error" });
  }
};

// ==========================================
// @route   POST /api/ai/suggest-skills
// @desc    Suggest missing and trending skills
// @access  Private
// ==========================================
const suggestSkills = async (req, res) => {
  try {
    const { currentSkills, targetRole } = req.body;

    const model = getModel();
    const prompt = `You are a tech career advisor. Based on the user's current skills and target role, suggest missing and trending skills they should learn.

Current Skills: ${currentSkills?.join(", ") || "None"}
Target Role: ${targetRole || "Software Developer"}

Respond with JSON in this exact format:
{
  "missingSkills": [
    { "name": "skill name", "priority": "high/medium/low", "reason": "why they need it" }
  ],
  "trendingSkills": [
    { "name": "skill name", "trend": "hot/growing/emerging", "description": "one line description" }
  ],
  "recommendedCertifications": [
    { "name": "cert name", "provider": "provider", "difficulty": "beginner/intermediate/advanced" }
  ],
  "learningPath": ["Step 1", "Step 2", "Step 3", "Step 4"]
}`;

    const result = await model.generateContent(prompt);
    const parsed = parseJSON(result.response.text());
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ message: "AI service error" });
  }
};

// ==========================================
// @route   POST /api/ai/suggest-projects
// @desc    Generate personalized project suggestions
// @access  Private
// ==========================================
const suggestProjects = async (req, res) => {
  try {
    const { skills, experienceLevel } = req.body;

    const model = getModel();
    const prompt = `You are a software engineering mentor. Suggest 6 personalized project ideas based on the user's skills and experience level.

Skills: ${skills?.join(", ") || "JavaScript, HTML, CSS"}
Experience Level: ${experienceLevel || "beginner"}

Respond with JSON in this exact format:
{
  "projects": [
    {
      "title": "project name",
      "description": "2 sentence description of what it does",
      "difficulty": "beginner/intermediate/advanced",
      "technologies": ["tech1", "tech2", "tech3"],
      "features": ["feature 1", "feature 2", "feature 3"],
      "estimatedTime": "2 weeks",
      "learningOutcomes": ["outcome 1", "outcome 2"]
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const parsed = parseJSON(result.response.text());
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ message: "AI service error" });
  }
};

// ==========================================
// @route   POST /api/ai/suggest-jobs
// @desc    Suggest suitable jobs and internships
// @access  Private
// ==========================================
const suggestJobs = async (req, res) => {
  try {
    const { skills, experienceLevel, targetRole } = req.body;

    const model = getModel();
    const prompt = `You are a career placement advisor. Suggest 8 suitable job/internship roles based on the user's profile.

Skills: ${skills?.join(", ") || "JavaScript"}
Experience Level: ${experienceLevel || "fresher"}
Target Role: ${targetRole || "Software Developer"}

Respond with JSON in this exact format:
{
  "jobs": [
    {
      "company": "company name",
      "role": "job title",
      "type": "job or internship",
      "location": "city or Remote",
      "requiredSkills": ["skill1", "skill2"],
      "salary": "salary range or stipend",
      "description": "2 sentence job description",
      "matchScore": <60-99>,
      "applyUrl": "https://linkedin.com/jobs",
      "tags": ["tag1", "tag2"]
    }
  ],
  "careerPaths": [
    {
      "path": "career path name",
      "description": "one line description",
      "avgSalary": "salary range",
      "skills": ["skill1", "skill2"]
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const parsed = parseJSON(result.response.text());
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ message: "AI service error" });
  }
};

// ==========================================
// @route   POST /api/ai/analyze-weakness
// @desc    Analyze resume weaknesses and suggest improvements
// @access  Private
// ==========================================
const analyzeWeakness = async (req, res) => {
  try {
    const { resume } = req.body;

    const model = getModel();
    const prompt = `You are a senior career counselor. Analyze this resume for weaknesses and provide detailed, actionable improvement suggestions.

${resume.rawText ? `Raw Resume Text:\n${resume.rawText}\n\n` : ""}Structured Resume Data:
${JSON.stringify(resume, null, 2)}

Respond with JSON in this exact format:
{
  "overallLevel": "beginner/intermediate/advanced",
  "overallVerdict": "one line honest assessment",
  "weaknesses": [
    {
      "area": "area name (e.g. Projects, Skills)",
      "severity": "high/medium/low",
      "issue": "what's wrong",
      "fix": "how to fix it"
    }
  ],
  "missingElements": ["missing element 1", "missing element 2"],
  "suggestedProjects": ["project 1", "project 2", "project 3"],
  "suggestedTechnologies": ["tech 1", "tech 2", "tech 3"],
  "suggestedCertifications": ["cert 1", "cert 2"],
  "learningPath": {
    "week1_2": "what to do",
    "week3_4": "what to do",
    "month2": "what to do",
    "month3": "what to do"
  },
  "encouragement": "motivational closing message"
}`;

    const result = await model.generateContent(prompt);
    const parsed = parseJSON(result.response.text());
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ message: "AI service error" });
  }
};

// ==========================================
// @route   POST /api/ai/rewrite-project
// @desc    Rewrite a project description professionally
// @access  Private
// ==========================================
const rewriteProject = async (req, res) => {
  try {
    const { projectName, description, technologies } = req.body;

    const model = getModel();
    const prompt = `Rewrite this project description for a resume. Make it impactful, quantified where possible, and ATS-friendly. Use strong action verbs.

Project: ${projectName}
Technologies: ${technologies?.join(", ")}
Original Description: ${description}

Return only the rewritten description (2-3 bullet points starting with action verbs).`;

    const result = await model.generateContent(prompt);
    const rewritten = result.response.text().trim();
    res.json({ rewritten });
  } catch (error) {
    res.status(500).json({ message: "AI service error" });
  }
};

// ==========================================
// @route   POST /api/ai/match-job
// @desc    Match resume against job description
// @access  Private
// ==========================================
const matchJob = async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;

    const model = getModel();
    const prompt = `You are an expert technical recruiter and ATS system. Analyze the following resume against the provided job description and calculate a match score.

${resume.rawText ? `Raw Resume Text:\n${resume.rawText}\n\n` : ""}Structured Resume Data:
${JSON.stringify(resume, null, 2)}

Job Description:
${jobDescription}

Respond with JSON in this exact format:
{
  "matchPercentage": <number 0-100>,
  "verdict": "one line summary of the match",
  "missingSkills": [
    { "skill": "skill name", "importance": "high/medium/low" }
  ],
  "strongSkills": [
    "skill 1", "skill 2"
  ],
  "weakAreas": [
    "area 1", "area 2"
  ],
  "atsTips": [
    "tip 1", "tip 2"
  ],
  "suggestedCertifications": [
    "cert 1", "cert 2"
  ],
  "suggestedProjects": [
    { "title": "project title", "description": "short description" }
  ],
  "careerImprovementTips": [
    "tip 1", "tip 2"
  ]
}`;

    const result = await model.generateContent(prompt);
    const parsed = parseJSON(result.response.text());
    res.json(parsed);
  } catch (error) {
    console.error("Match job error:", error);
    res.status(500).json({ message: "AI service error" });
  }
};

// ==========================================
// @route   POST /api/ai/optimize-resume-for-job
// @desc    Rewrite resume to match job description
// @access  Private
// ==========================================
const optimizeResumeForJob = async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;

    const model = getModel();
    const prompt = `You are an expert resume writer. The user wants to apply for a specific job. 
Rewrite the user's Professional Summary and their most recent Project descriptions to better align with the Job Description. Use keywords from the job description naturally.

${resume.rawText ? `Raw Resume Text:\n${resume.rawText}\n\n` : ""}Structured Resume Data:
${JSON.stringify(resume, null, 2)}

Job Description:
${jobDescription}

Respond with JSON in this exact format:
{
  "optimizedSummary": "A powerful, 3-4 sentence professional summary optimized for this job.",
  "optimizedProjects": [
    {
      "originalTitle": "The original project title",
      "optimizedDescription": "The new optimized description as a single string (use bullet points if appropriate)"
    }
  ],
  "addedKeywords": ["keyword1", "keyword2"]
}`;

    const result = await model.generateContent(prompt);
    const parsed = parseJSON(result.response.text());
    res.json(parsed);
  } catch (error) {
    console.error("Optimize resume error:", error);
    res.status(500).json({ message: "AI service error" });
  }
};

module.exports = {
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
};
