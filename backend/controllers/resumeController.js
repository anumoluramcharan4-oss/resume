// ==========================================
// controllers/resumeController.js — Resume Hub Management
// ==========================================

const Resume = require("../models/Resume");
const ResumeVersion = require("../models/ResumeVersion");
const ResumeShare = require("../models/ResumeShare");
const ResumeAnalytic = require("../models/ResumeAnalytic");
const aiClient = require("../config/aiClient");
const crypto = require("crypto");

// PDF text extraction using pdfjs-dist (dynamically imported for ESM compatibility)
const extractPdfText = async (pdfBuffer) => {
  const pdfjs = await import("pdfjs-dist");
  const data = new Uint8Array(pdfBuffer);
  const doc = await pdfjs.getDocument({ data }).promise;
  let text = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(" ") + "\n";
  }
  return text;
};

// Setup AI model shim for OpenRouter
const genAI = aiClient;
aiClient.getGenerativeModel = () => aiClient;

// Helper: Plain text resume builder for search/AI matching
const generateRawText = (resume) => {
  let text = "";
  if (resume.personal) {
    text += `${resume.personal.fullName || ""}\n`;
    text += `${resume.personal.email || ""} | ${resume.personal.phone || ""} | ${resume.personal.location || ""}\n`;
    if (resume.personal.linkedin) text += `LinkedIn: ${resume.personal.linkedin}\n`;
    if (resume.personal.github) text += `GitHub: ${resume.personal.github}\n`;
    if (resume.personal.portfolio) text += `Portfolio: ${resume.personal.portfolio}\n`;
  }
  if (resume.about) {
    text += `\nProfessional Summary\n${resume.about}\n`;
  }
  if (resume.skills && resume.skills.length > 0) {
    text += `\nSkills\n${resume.skills.map(s => typeof s === "string" ? s : s.name).join(", ")}\n`;
  }
  if (resume.experience && resume.experience.length > 0) {
    text += `\nWork Experience\n`;
    resume.experience.forEach(exp => {
      text += `${exp.role} at ${exp.company} (${exp.startDate} - ${exp.current ? "Present" : exp.endDate || ""})\n`;
      if (exp.location) text += `Location: ${exp.location}\n`;
      if (exp.description) text += `${exp.description}\n`;
      text += "\n";
    });
  }
  if (resume.projects && resume.projects.length > 0) {
    text += `\nProjects\n`;
    resume.projects.forEach(proj => {
      text += `${proj.name}\n`;
      if (proj.technologies && proj.technologies.length > 0) {
        text += `Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies}\n`;
      }
      if (proj.description) text += `${proj.description}\n`;
      text += "\n";
    });
  }
  if (resume.education && resume.education.length > 0) {
    text += `\nEducation\n`;
    resume.education.forEach(edu => {
      text += `${edu.degree || ""} ${edu.field ? `in ${edu.field}` : ""} - ${edu.institution || ""} (${edu.startDate || ""} - ${edu.endDate || ""})\n`;
      if (edu.grade) text += `Grade: ${edu.grade}\n`;
      if (edu.description) text += `${edu.description}\n`;
      text += "\n";
    });
  }
  if (resume.certifications && resume.certifications.length > 0) {
    text += `\nCertifications\n`;
    resume.certifications.forEach(cert => {
      text += `${cert.name || ""} - ${cert.issuer || ""} (${cert.date || ""})\n`;
    });
  }
  return text.trim();
};

// Helper: Profile Completeness Engine
const calculateCompletion = (resume) => {
  let score = 0;
  
  // 1. Personal Details (20%)
  if (resume.personal) {
    let pScore = 0;
    if (resume.personal.fullName) pScore += 5;
    if (resume.personal.email) pScore += 5;
    if (resume.personal.phone) pScore += 5;
    if (resume.personal.location) pScore += 5;
    score += pScore;
  }
  
  // 2. Summary (10%)
  if (resume.about && resume.about.trim().length > 10) {
    score += 10;
  }
  
  // 3. Skills (15%)
  if (resume.skills && resume.skills.length > 0) {
    score += Math.min(15, resume.skills.length * 5); // 5% per skill, up to 15%
  }
  
  // 4. Projects (20%)
  if (resume.projects && resume.projects.length > 0) {
    const validProjects = resume.projects.filter(p => p.name && p.description);
    score += Math.min(20, validProjects.length * 10);
  }
  
  // 5. Work Experience (25%)
  if (resume.experience && resume.experience.length > 0) {
    const validExps = resume.experience.filter(e => e.company && e.role && e.description);
    score += Math.min(25, validExps.length * 12.5);
  }
  
  // 6. Education & Certifications (10%)
  if (resume.education && resume.education.length > 0) {
    score += 5;
  }
  if (resume.certifications && resume.certifications.length > 0) {
    score += 5;
  }
  
  return Math.min(100, Math.round(score));
};

// ==========================================
// @route   GET /api/resumes
// @desc    Get resumes with filtering, search, and sorting
// @access  Private
// ==========================================
const getResumes = async (req, res) => {
  try {
    const { search, status, sortBy } = req.query;
    
    // Base query: only current user
    let query = { user: req.user._id };
    
    // Status Filter (active vs archived)
    if (status === "archived") {
      query.isArchived = true;
    } else if (status === "active") {
      query.isArchived = false;
    } else if (!status) {
      // Default: exclude archived resumes
      query.isArchived = false;
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { "personal.fullName": { $regex: search, $options: "i" } },
        { "personal.role": { $regex: search, $options: "i" } },
      ];
    }
    
    // Sorting
    let sortOptions = { updatedAt: -1 };
    if (sortBy === "title") {
      sortOptions = { title: 1 };
    } else if (sortBy === "atsScore") {
      sortOptions = { atsScore: -1 };
    } else if (sortBy === "createdAt") {
      sortOptions = { createdAt: -1 };
    }
    
    const resumes = await Resume.find(query).sort(sortOptions);
    
    // Calculate aggregate metrics for Dashboard
    const totalCount = await Resume.countDocuments({ user: req.user._id });
    const activeCount = await Resume.countDocuments({ user: req.user._id, isArchived: false });
    const archivedCount = await Resume.countDocuments({ user: req.user._id, isArchived: true });
    
    const hasAtsScored = await Resume.find({ user: req.user._id, atsScore: { $ne: null } });
    const avgAtsScore = hasAtsScored.length > 0 
      ? Math.round(hasAtsScored.reduce((acc, curr) => acc + curr.atsScore, 0) / hasAtsScored.length) 
      : 0;

    const totalViews = resumes.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
    const totalDownloads = resumes.reduce((acc, curr) => acc + (curr.downloadsCount || 0), 0);
    
    res.json({
      resumes,
      metrics: {
        totalResumes: totalCount,
        activeResumes: activeCount,
        archivedResumes: archivedCount,
        averageAtsScore: avgAtsScore,
        totalViews,
        totalDownloads
      }
    });
  } catch (error) {
    console.error("Fetch resumes error:", error);
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
      user: req.user._id,
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
// @desc    Create a new resume (starts at Version 1)
// @access  Private
// ==========================================
const createResume = async (req, res) => {
  try {
    const compPct = calculateCompletion(req.body);
    const resumeData = {
      ...req.body,
      user: req.user._id,
      completionPercentage: compPct,
      rawText: generateRawText(req.body),
    };

    const resume = await Resume.create(resumeData);

    // Save Version 1 snapshot
    await ResumeVersion.create({
      resume: resume._id,
      version: 1,
      title: resume.title,
      template: resume.template,
      personal: resume.personal,
      about: resume.about,
      skills: resume.skills,
      education: resume.education,
      experience: resume.experience,
      projects: resume.projects,
      certifications: resume.certifications,
      achievements: resume.achievements,
      languages: resume.languages,
      atsScore: resume.atsScore,
      aiAnalysis: resume.aiAnalysis,
      rawText: resume.rawText,
    });

    res.status(201).json({ message: "Resume created successfully!", resume });
  } catch (error) {
    console.error("Create resume error:", error);
    res.status(500).json({ message: "Error creating resume" });
  }
};

// ==========================================
// @route   PUT /api/resumes/:id
// @desc    Update a resume and increment version snapshot
// @access  Private
// ==========================================
const updateResume = async (req, res) => {
  try {
    const compPct = calculateCompletion(req.body);
    
    // Find existing resume
    const existing = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!existing) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Perform update with auto-generated rawText
    const updatedResume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, completionPercentage: compPct, rawText: generateRawText(req.body) },
      { new: true, runValidators: true }
    );

    // Increment version in ResumeVersion
    const lastVersionDoc = await ResumeVersion.findOne({ resume: req.params.id }).sort({ version: -1 });
    const nextVer = lastVersionDoc ? lastVersionDoc.version + 1 : 1;

    await ResumeVersion.create({
      resume: updatedResume._id,
      version: nextVer,
      title: updatedResume.title,
      template: updatedResume.template,
      personal: updatedResume.personal,
      about: updatedResume.about,
      skills: updatedResume.skills,
      education: updatedResume.education,
      experience: updatedResume.experience,
      projects: updatedResume.projects,
      certifications: updatedResume.certifications,
      achievements: updatedResume.achievements,
      languages: updatedResume.languages,
      atsScore: updatedResume.atsScore,
      aiAnalysis: updatedResume.aiAnalysis,
      rawText: updatedResume.rawText,
    });

    res.json({ message: `Resume saved! Captured Version ${nextVer}.`, resume: updatedResume });
  } catch (error) {
    console.error("Update resume error:", error);
    res.status(500).json({ message: "Error updating resume" });
  }
};

// ==========================================
// @route   DELETE /api/resumes/:id
// @desc    Delete resume and related versions, shares, analytics
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

    // Cascade deletions
    await ResumeVersion.deleteMany({ resume: req.params.id });
    await ResumeShare.deleteMany({ resume: req.params.id });
    await ResumeAnalytic.deleteMany({ resume: req.params.id });

    res.json({ message: "Resume and all history deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting resume" });
  }
};

// ==========================================
// @route   POST /api/resumes/:id/archive
// @desc    Archive a resume
// @access  Private
// ==========================================
const archiveResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isArchived: true },
      { new: true }
    );
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json({ message: "Resume archived successfully", resume });
  } catch (err) {
    res.status(500).json({ message: "Error archiving resume" });
  }
};

// ==========================================
// @route   POST /api/resumes/:id/restore
// @desc    Restore an archived resume
// @access  Private
// ==========================================
const restoreResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isArchived: false },
      { new: true }
    );
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json({ message: "Resume restored successfully", resume });
  } catch (err) {
    res.status(500).json({ message: "Error restoring resume" });
  }
};

// ==========================================
// @route   POST /api/resumes/:id/duplicate
// @desc    Duplicate a resume
// @access  Private
// ==========================================
const duplicateResume = async (req, res) => {
  try {
    const original = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!original) return res.status(404).json({ message: "Resume not found" });

    // Copy fields
    const copyData = original.toObject();
    delete copyData._id;
    delete copyData.createdAt;
    delete copyData.updatedAt;
    copyData.title = `${copyData.title} (Copy)`;
    copyData.viewsCount = 0;
    copyData.downloadsCount = 0;

    const copy = await Resume.create(copyData);

    // Initial version for duplicated copy
    await ResumeVersion.create({
      resume: copy._id,
      version: 1,
      title: copy.title,
      template: copy.template,
      personal: copy.personal,
      about: copy.about,
      skills: copy.skills,
      education: copy.education,
      experience: copy.experience,
      projects: copy.projects,
      certifications: copy.certifications,
      achievements: copy.achievements,
      languages: copy.languages,
      atsScore: copy.atsScore,
      aiAnalysis: copy.aiAnalysis,
    });

    res.status(201).json({ message: "Resume duplicated!", resume: copy });
  } catch (err) {
    res.status(500).json({ message: "Error duplicating resume" });
  }
};

// ==========================================
// @route   POST /api/resumes/:id/share
// @desc    Set public sharing parameters
// @access  Private
// ==========================================
const shareResume = async (req, res) => {
  try {
    const { isPublic, expiresAt } = req.body;
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    let shareDoc = await ResumeShare.findOne({ resume: req.params.id });

    if (!shareDoc) {
      const shareId = crypto.randomBytes(8).toString("hex");
      shareDoc = await ResumeShare.create({
        resume: resume._id,
        user: req.user._id,
        shareId,
        isPublic: isPublic !== undefined ? isPublic : true,
        expiresAt: expiresAt || null
      });
    } else {
      shareDoc.isPublic = isPublic !== undefined ? isPublic : shareDoc.isPublic;
      shareDoc.expiresAt = expiresAt !== undefined ? expiresAt : shareDoc.expiresAt;
      await shareDoc.save();
    }

    res.json({ message: "Share link generated successfully", share: shareDoc });
  } catch (err) {
    console.error("Sharing error:", err);
    res.status(500).json({ message: "Error sharing resume" });
  }
};

// ==========================================
// @route   GET /api/resumes/:id/share
// @desc    Get sharing configurations
// @access  Private
// ==========================================
const getShareSettings = async (req, res) => {
  try {
    const share = await ResumeShare.findOne({ resume: req.params.id, user: req.user._id });
    if (!share) {
      return res.json({ share: null });
    }
    res.json({ share });
  } catch (err) {
    res.status(500).json({ message: "Error fetching share configuration" });
  }
};

// ==========================================
// @route   GET /api/resumes/:id/versions
// @desc    Fetch snapshots of resume versions
// @access  Private
// ==========================================
const getVersionHistory = async (req, res) => {
  try {
    const versions = await ResumeVersion.find({ resume: req.params.id }).sort({ version: -1 });
    res.json({ versions });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving version history" });
  }
};

// ==========================================
// @route   POST /api/resumes/:id/versions/:versionId/restore
// @desc    Restore the resume to a previous version state
// @access  Private
// ==========================================
const restoreVersion = async (req, res) => {
  try {
    const versionDoc = await ResumeVersion.findOne({
      _id: req.params.versionId,
      resume: req.params.id,
    });

    if (!versionDoc) {
      return res.status(404).json({ message: "Version record not found" });
    }

    // Set active fields to snapshot
    const updated = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title: versionDoc.title,
        template: versionDoc.template,
        personal: versionDoc.personal,
        about: versionDoc.about,
        skills: versionDoc.skills,
        education: versionDoc.education,
        experience: versionDoc.experience,
        projects: versionDoc.projects,
        certifications: versionDoc.certifications,
        achievements: versionDoc.achievements,
        languages: versionDoc.languages,
        atsScore: versionDoc.atsScore,
        aiAnalysis: versionDoc.aiAnalysis,
        rawText: versionDoc.rawText,
      },
      { new: true }
    );

    // Save a new version representing this restoration action
    const lastVersionDoc = await ResumeVersion.findOne({ resume: req.params.id }).sort({ version: -1 });
    const nextVer = lastVersionDoc ? lastVersionDoc.version + 1 : 1;

    await ResumeVersion.create({
      resume: updated._id,
      version: nextVer,
      title: updated.title,
      template: updated.template,
      personal: updated.personal,
      about: updated.about,
      skills: updated.skills,
      education: updated.education,
      experience: updated.experience,
      projects: updated.projects,
      certifications: updated.certifications,
      achievements: updated.achievements,
      languages: updated.languages,
      atsScore: updated.atsScore,
      aiAnalysis: updated.aiAnalysis,
      rawText: updated.rawText,
    });

    res.json({ message: `Successfully restored version snapshot! Created Version ${nextVer}`, resume: updated });
  } catch (err) {
    console.error("Restoring version error:", err);
    res.status(500).json({ message: "Error restoring snapshot" });
  }
};

// ==========================================
// @route   POST /api/resumes/:id/analyze
// @desc    Evaluate ATS score and compile feedback from Gemini
// @access  Private
// ==========================================
const analyzeResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (!genAI) {
      return res.status(500).json({ message: "AI client not initialized. Configure OPENROUTER_API_KEY." });
    }

    const model = genAI.getGenerativeModel();
    const prompt = `You are a professional ATS scanner and technical recruiter. Analyze the following resume.
    
    ${resume.rawText ? `Raw Resume Text:\n${resume.rawText}\n\n` : ""}Structured Resume Data:
    ${JSON.stringify(resume, null, 2)}
    
    Respond in JSON format only. Clean JSON block, no markdown enclosing. Return exactly this schema:
    {
      "score": <number 0 to 100>,
      "keywordMatch": <number 0 to 100>,
      "readabilityScore": <number 0 to 100>,
      "missingSkills": ["skill 1", "skill 2", "skill 3"],
      "formattingIssues": ["issue 1", "issue 2"],
      "improvements": ["tip 1", "tip 2", "tip 3"],
      "sectionFeedback": {
        "personal": "Feedback on personal info",
        "about": "Feedback on summary",
        "experience": "Feedback on work history",
        "projects": "Feedback on projects"
      }
    }`;

    const result = await model.generateContent(prompt);
    let textResult = result.response.text().trim();
    
    // Clean JSON formatting
    textResult = textResult.replace(/```json\n?|\n?```/g, "").trim();
    const analysis = JSON.parse(textResult);

    // Save analysis and ATS Score to resume
    resume.atsScore = analysis.score || 70;
    resume.aiAnalysis = analysis;
    await resume.save();

    // Create a new snapshot capturing this analysis change
    const lastVersionDoc = await ResumeVersion.findOne({ resume: resume._id }).sort({ version: -1 });
    const nextVer = lastVersionDoc ? lastVersionDoc.version + 1 : 1;

    await ResumeVersion.create({
      resume: resume._id,
      version: nextVer,
      title: resume.title,
      template: resume.template,
      personal: resume.personal,
      about: resume.about,
      skills: resume.skills,
      education: resume.education,
      experience: resume.experience,
      projects: resume.projects,
      certifications: resume.certifications,
      achievements: resume.achievements,
      languages: resume.languages,
      atsScore: resume.atsScore,
      aiAnalysis: resume.aiAnalysis,
      rawText: resume.rawText,
    });

    res.json({ message: "AI Scan Completed! Added Version Snapshot.", analysis });
  } catch (err) {
    console.error("AI Analysis Error:", err);
    res.status(500).json({ message: "AI analysis failed. Verify Gemini config." });
  }
};

// ==========================================
// @route   POST /api/resumes/:id/track-export
// @desc    Increment download/print metrics
// @access  Private
// ==========================================
const trackExport = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $inc: { downloadsCount: 1 } },
      { new: true }
    );

    if (!resume) return res.status(404).json({ message: "Resume not found" });

    // Track analytics event
    await ResumeAnalytic.create({
      resume: resume._id,
      action: "download",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      referrer: req.headers["referer"] || ""
    });

    res.json({ message: "Export tracked successfully", downloadsCount: resume.downloadsCount });
  } catch (err) {
    res.status(500).json({ message: "Error tracking download" });
  }
};

// ==========================================
// @route   GET /api/resumes/public/:shareId
// @desc    Public endpoint to view shared resumes (Increment views, log analytics)
// @access  Public
// ==========================================
const getPublicResume = async (req, res) => {
  try {
    const share = await ResumeShare.findOne({ shareId: req.params.shareId });
    
    if (!share) {
      return res.status(404).json({ message: "Shared link not found or expired" });
    }

    if (!share.isPublic) {
      return res.status(403).json({ message: "This shared resume is private" });
    }

    if (share.expiresAt && new Date() > share.expiresAt) {
      return res.status(410).json({ message: "The shared link has expired" });
    }

    const resume = await Resume.findById(share.resume);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Increment share metrics
    share.viewsCount += 1;
    await share.save();

    // Increment resume metrics
    resume.viewsCount += 1;
    await resume.save();

    // Log view action in analytics
    await ResumeAnalytic.create({
      resume: resume._id,
      share: share._id,
      action: "view",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      referrer: req.headers["referer"] || ""
    });

    res.json({ resume });
  } catch (err) {
    console.error("Public share fetch error:", err);
    res.status(500).json({ message: "Error loading shared resume" });
  }
};

// ==========================================
// @route   POST /api/resumes/import
// @desc    Import a pre-existing resume text and structure it via Gemini AI
// @access  Private
// ==========================================
const importResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    if (!resumeText) {
      return res.status(400).json({ message: "Resume text is required" });
    }

    if (!genAI) {
      return res.status(500).json({ message: "AI client not initialized. Configure OPENROUTER_API_KEY." });
    }

    const model = genAI.getGenerativeModel();
    const prompt = `You are an expert resume parsing AI. Extract and map the following raw resume text into the exact JSON format specified below.
    Return ONLY a valid JSON object. Do not include markdown code block markers (like \`\`\`json) or any conversational text.
    If any fields or sections are missing from the text, return empty strings or empty arrays as shown in the template. Do not invent any facts not present in the text, but ensure correct formatting.

    Required JSON Schema:
    {
      "title": "A short, standard professional role title (e.g. 'Frontend Developer', 'Senior Product Manager')",
      "template": "modern",
      "personal": {
        "fullName": "Name of the candidate",
        "email": "Email address",
        "phone": "Phone number",
        "location": "City, State, or Country",
        "linkedin": "LinkedIn profile link or username",
        "github": "GitHub username or link",
        "portfolio": "Portfolio link",
        "twitter": "Twitter link or username"
      },
      "about": "A concise professional summary or bio of the candidate (3-4 sentences)",
      "skills": [
        { "name": "Skill Name", "level": "one of: beginner, intermediate, advanced, expert" }
      ],
      "education": [
        {
          "institution": "School/University Name",
          "degree": "Degree (e.g. B.S., Master of Science)",
          "field": "Field of study (e.g. Computer Science)",
          "startDate": "Start date",
          "endDate": "End date or 'Present'",
          "grade": "GPA or Grade if mentioned",
          "description": "Any additional achievements or study details"
        }
      ],
      "experience": [
        {
          "company": "Company Name",
          "role": "Job Title",
          "location": "Location",
          "startDate": "Start Date",
          "endDate": "End Date or 'Present'",
          "current": true or false,
          "description": "Responsibilities and accomplishments. Format as multiple bullet points or lines."
        }
      ],
      "projects": [
        {
          "name": "Project Name",
          "description": "Short description of the project",
          "technologies": ["tech 1", "tech 2"],
          "liveUrl": "Demo link",
          "githubUrl": "Code link",
          "startDate": "Start date",
          "endDate": "End date"
        }
      ],
      "certifications": [
        {
          "name": "Certification Name",
          "issuer": "Issuing organization",
          "date": "Date issued",
          "url": "Certificate verification link"
        }
      ],
      "achievements": [
        {
          "title": "Achievement name",
          "description": "Description of achievement",
          "date": "Date received"
        }
      ],
      "languages": [
        {
          "name": "Language Name",
          "proficiency": "one of: basic, conversational, fluent, native"
        }
      ]
    }

    Raw Resume Text:
    ${resumeText}`;

    const result = await model.generateContent(prompt);
    let textResult = result.response.text().trim();
    
    // Parse the JSON safely
    textResult = textResult.replace(/```json\n?|\n?```/g, "").trim();
    let parsedData;
    try {
      parsedData = JSON.parse(textResult);
    } catch (parseError) {
      console.error("JSON parsing failed, trying to extract JSON substring:", parseError);
      // Fallback: try to extract JSON from string
      const startIdx = textResult.indexOf("{");
      const endIdx = textResult.lastIndexOf("}");
      if (startIdx !== -1 && endIdx !== -1) {
        parsedData = JSON.parse(textResult.substring(startIdx, endIdx + 1));
      } else {
        throw new Error("Unable to parse Gemini output as JSON");
      }
    }

    // Assign owner and titles
    parsedData.user = req.user._id;
    if (title) {
      parsedData.title = title;
    } else if (!parsedData.title || parsedData.title === "My Resume") {
      parsedData.title = parsedData.personal?.fullName 
        ? `${parsedData.personal.fullName}'s Resume` 
        : "Imported Resume";
    }
    
    parsedData.template = "modern"; // Default template

    // Compute completion percentage
    parsedData.completionPercentage = calculateCompletion(parsedData);

    // Save initial Resume doc
    const newResume = new Resume(parsedData);
    newResume.rawText = resumeText;

    // Perform immediate ATS Scan using Gemini
    try {
      const atsPrompt = `You are a professional ATS scanner and technical recruiter. Analyze the following resume.
      
      ${newResume.rawText ? `Raw Resume Text:\n${newResume.rawText}\n\n` : ""}Structured Resume Data:
      ${JSON.stringify(newResume, null, 2)}
      
      Respond in JSON format only. Clean JSON block, no markdown enclosing. Return exactly this schema:
      {
        "score": <number 0 to 100>,
        "keywordMatch": <number 0 to 100>,
        "readabilityScore": <number 0 to 100>,
        "missingSkills": ["skill 1", "skill 2", "skill 3"],
        "formattingIssues": ["issue 1", "issue 2"],
        "improvements": ["tip 1", "tip 2", "tip 3"],
        "sectionFeedback": {
          "personal": "Feedback on personal info",
          "about": "Feedback on summary",
          "experience": "Feedback on work history",
          "projects": "Feedback on projects"
        }
      }`;
      const atsResult = await model.generateContent(atsPrompt);
      let atsText = atsResult.response.text().trim();
      atsText = atsText.replace(/```json\n?|\n?```/g, "").trim();
      
      let analysis;
      try {
        analysis = JSON.parse(atsText);
      } catch (parseError) {
        const startIdx = atsText.indexOf("{");
        const endIdx = atsText.lastIndexOf("}");
        if (startIdx !== -1 && endIdx !== -1) {
          analysis = JSON.parse(atsText.substring(startIdx, endIdx + 1));
        } else {
          throw parseError;
        }
      }
      
      newResume.atsScore = analysis.score || 70;
      newResume.aiAnalysis = analysis;
    } catch (atsErr) {
      console.error("Immediate ATS scan failed on import:", atsErr);
    }

    await newResume.save();

    // Capture initial version timeline snapshot
    await ResumeVersion.create({
      resume: newResume._id,
      version: 1,
      title: newResume.title,
      template: newResume.template,
      personal: newResume.personal,
      about: newResume.about,
      skills: newResume.skills,
      education: newResume.education,
      experience: newResume.experience,
      projects: newResume.projects,
      certifications: newResume.certifications,
      achievements: newResume.achievements,
      languages: newResume.languages,
      atsScore: newResume.atsScore,
      aiAnalysis: newResume.aiAnalysis,
      rawText: newResume.rawText,
    });

    res.status(201).json(newResume);
  } catch (err) {
    console.error("Resume Import Error:", err);
    res.status(500).json({ message: "Failed to parse resume text. Please check the format and try again." });
  }
};

// ==========================================
// diffResumes — Helper for structural diffing
// ==========================================
const diffResumes = (prev, current) => {
  const changes = [];
  const p = prev && typeof prev.toObject === "function" ? prev.toObject() : prev || {};
  const c = current && typeof current.toObject === "function" ? current.toObject() : current || {};

  if (p.title !== c.title) {
    changes.push(`Title changed from "${p.title || "Untitled"}" to "${c.title || "Untitled"}"`);
  }

  // Personal
  if (p.personal?.fullName !== c.personal?.fullName) {
    changes.push(`Full name updated to "${c.personal?.fullName || ""}"`);
  }
  if (p.personal?.email !== c.personal?.email) {
    changes.push("Contact email updated");
  }
  if (p.personal?.phone !== c.personal?.phone) {
    changes.push("Phone number updated");
  }
  if (p.personal?.location !== c.personal?.location) {
    changes.push("Location updated");
  }
  if (p.personal?.linkedin !== c.personal?.linkedin) {
    changes.push("LinkedIn profile updated");
  }
  if (p.personal?.github !== c.personal?.github) {
    changes.push("GitHub link updated");
  }

  // Skills
  const prevSkills = (p.skills || []).map(s => typeof s === "string" ? s : s.name).filter(Boolean);
  const currSkills = (c.skills || []).map(s => typeof s === "string" ? s : s.name).filter(Boolean);
  const addedSkills = currSkills.filter(s => !prevSkills.includes(s));
  const removedSkills = prevSkills.filter(s => !currSkills.includes(s));
  addedSkills.forEach(s => changes.push(`Added skill: ${s}`));
  removedSkills.forEach(s => changes.push(`Removed skill: ${s}`));

  // Experience
  const prevJobs = p.experience || [];
  const currJobs = c.experience || [];
  currJobs.forEach(cj => {
    const match = prevJobs.find(pj => pj.company === cj.company && pj.role === cj.role);
    if (!match) {
      changes.push(`Added work experience: ${cj.role} at ${cj.company}`);
    } else if (match.description !== cj.description || match.startDate !== cj.startDate || match.endDate !== cj.endDate) {
      changes.push(`Updated details for role: ${cj.role} at ${cj.company}`);
    }
  });
  prevJobs.forEach(pj => {
    const match = currJobs.find(cj => cj.company === pj.company && cj.role === pj.role);
    if (!match) {
      changes.push(`Removed work experience: ${pj.role} at ${pj.company}`);
    }
  });

  // Projects
  const prevProjects = p.projects || [];
  const currProjects = c.projects || [];
  currProjects.forEach(cp => {
    const match = prevProjects.find(pp => pp.name === cp.name);
    if (!match) {
      changes.push(`Added project: ${cp.name}`);
    } else if (match.description !== cp.description || (match.technologies || []).join(",") !== (cp.technologies || []).join(",")) {
      changes.push(`Updated project details: ${cp.name}`);
    }
  });
  prevProjects.forEach(pp => {
    const match = currProjects.find(cp => cp.name === pp.name);
    if (!match) {
      changes.push(`Removed project: ${pp.name}`);
    }
  });

  // Education
  const prevEdu = p.education || [];
  const currEdu = c.education || [];
  currEdu.forEach(ce => {
    const match = prevEdu.find(pe => pe.institution === ce.institution && pe.degree === ce.degree);
    if (!match) {
      changes.push(`Added education: ${ce.degree} from ${ce.institution}`);
    } else if (match.grade !== ce.grade || match.endDate !== ce.endDate) {
      changes.push(`Updated details for education: ${ce.degree} from ${ce.institution}`);
    }
  });
  prevEdu.forEach(pe => {
    const match = currEdu.find(ce => ce.institution === pe.institution && ce.degree === pe.degree);
    if (!match) {
      changes.push(`Removed education: ${pe.degree} from ${pe.institution}`);
    }
  });

  // Certifications
  const prevCerts = p.certifications || [];
  const currCerts = c.certifications || [];
  currCerts.forEach(cc => {
    const match = prevCerts.find(pc => pc.name === cc.name);
    if (!match) {
      changes.push(`Added certification: ${cc.name}`);
    }
  });
  prevCerts.forEach(pc => {
    const match = currCerts.find(cc => cc.name === pc.name);
    if (!match) {
      changes.push(`Removed certification: ${pc.name}`);
    }
  });

  // Achievements
  const prevAch = p.achievements || [];
  const currAch = c.achievements || [];
  currAch.forEach(ca => {
    const title = ca.title || ca.name;
    const match = prevAch.find(pa => (pa.title || pa.name) === title);
    if (!match) {
      changes.push(`Added achievement: ${title}`);
    }
  });
  prevAch.forEach(pa => {
    const title = pa.title || pa.name;
    const match = currAch.find(ca => (ca.title || ca.name) === title);
    if (!match) {
      changes.push(`Removed achievement: ${title}`);
    }
  });

  if (p.atsScore !== c.atsScore && c.atsScore !== undefined && c.atsScore !== null) {
    changes.push(`ATS Score changed from ${p.atsScore || 0}% to ${c.atsScore || 0}%`);
  }

  return changes;
};

// ==========================================
// @route   POST /api/resumes/import-pdf
// @desc    Parse resume PDF via Gemini and return structured fields + suggestions
// @access  Private
// ==========================================
const importPdfResume = async (req, res) => {
  try {
    const { pdfData, fileName, title } = req.body;
    if (!pdfData) {
      return res.status(400).json({ message: "PDF base64 data is required" });
    }

    if (!genAI) {
      return res.status(500).json({ message: "AI client not initialized. Configure OpenRouter API Key." });
    }

    // Strip prefix from base64 string if present
    let cleanBase64 = pdfData;
    if (cleanBase64.startsWith("data:")) {
      cleanBase64 = cleanBase64.split(",")[1];
    }

    // Extract text locally from PDF buffer using pdfjs-dist
    const pdfBuffer = Buffer.from(cleanBase64, "base64");
    const extractedText = await extractPdfText(pdfBuffer);

    const model = genAI.getGenerativeModel();

    const prompt = `You are a professional ATS resume parsing system and expert career advisor.
Read the extracted resume text below and perform two actions:
1. Extract all candidate information structurally.
2. Evaluate and analyze the resume to provide optimization suggestions.

Return ONLY a valid JSON object matching the exact schema below. Do not enclose it in markdown blocks (such as \`\`\`json) or include any extra text.

Required JSON Schema:
{
  "parsedData": {
    "title": "A short, standard professional role title (e.g. 'Frontend Developer', 'Senior Product Manager')",
    "template": "modern",
    "personal": {
      "fullName": "Name of the candidate",
      "email": "Email address",
      "phone": "Phone number",
      "location": "City, State, or Country",
      "linkedin": "LinkedIn profile link or username",
      "github": "GitHub username or link",
      "portfolio": "Portfolio link",
      "twitter": "Twitter link or username"
    },
    "about": "A concise professional summary or bio of the candidate (3-4 sentences)",
    "skills": [
      { "name": "Skill Name", "level": "one of: beginner, intermediate, advanced, expert" }
    ],
    "education": [
      {
        "institution": "School/University Name",
        "degree": "Degree (e.g. B.S., Master of Science)",
        "field": "Field of study (e.g. Computer Science)",
        "startDate": "Start date",
        "endDate": "End date or 'Present'",
        "grade": "GPA or Grade if mentioned",
        "description": "Any additional achievements or study details"
      }
    ],
    "experience": [
      {
        "company": "Company Name",
        "role": "Job Title",
        "location": "Location",
        "startDate": "Start Date",
        "endDate": "End Date or 'Present'",
        "current": true or false,
        "description": "Responsibilities and accomplishments. Format as multiple bullet points or lines."
      }
    ],
    "projects": [
      {
        "name": "Project Name",
        "description": "Short description of the project",
        "technologies": ["tech 1", "tech 2"],
        "liveUrl": "Demo link",
        "githubUrl": "Code link",
        "startDate": "Start date",
        "endDate": "End date"
      }
    ],
    "certifications": [
      {
        "name": "Certification Name",
        "issuer": "Issuing organization",
        "date": "Date issued",
        "url": "Certificate verification link"
      }
    ],
    "achievements": [
      {
        "title": "Achievement name",
        "description": "Description of achievement (e.g., hackathons, awards, competitions)",
        "date": "Date received"
      }
    ],
    "languages": [
      {
        "name": "Language Name",
        "proficiency": "one of: basic, conversational, fluent, native"
      }
    ]
  },
  "suggestions": {
    "missingSkills": ["skill 1", "skill 2", "skill 3"],
    "improvements": ["improvement tip 1", "improvement tip 2"],
    "atsScore": 85,
    "careerReadinessScore": 80,
    "recommendedInternships": ["Internship Title at Company 1", "Internship Title at Company 2"],
    "recommendedCareerPaths": ["Career Path 1", "Career Path 2"]
  }
}

Extracted Resume Text:
${extractedText}`;

    const result = await model.generateContent(prompt);
    let textResult = result.response.text().trim();

    // Clean JSON formatting
    textResult = textResult.replace(/```json\n?|\n?```/g, "").trim();
    let parsedJson;
    try {
      parsedJson = JSON.parse(textResult);
    } catch (parseError) {
      console.error("JSON parsing failed, trying to extract JSON substring:", parseError);
      const startIdx = textResult.indexOf("{");
      const endIdx = textResult.lastIndexOf("}");
      if (startIdx !== -1 && endIdx !== -1) {
        parsedJson = JSON.parse(textResult.substring(startIdx, endIdx + 1));
      } else {
        throw new Error("Unable to parse Gemini output as JSON");
      }
    }

    parsedJson.rawText = extractedText;
    res.json(parsedJson);
  } catch (error) {
    console.error("PDF Parse error:", error);
    res.status(500).json({ message: "Failed to parse PDF resume: " + error.message });
  }
};

// ==========================================
// @route   POST /api/resumes/import/save
// @desc    Save imported resume data, update User Profile, and initialize Career Advisor
// @access  Private
// ==========================================
const saveImportedResume = async (req, res) => {
  try {
    const { resumeId, parsedData, suggestions, originalPdfData, originalPdfName, rawText } = req.body;

    if (!parsedData) {
      return res.status(400).json({ message: "Parsed data is required" });
    }

    let resume;
    let isNew = false;
    let changes = ["Initial resume import"];

    if (resumeId) {
      resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
      if (!resume) {
        return res.status(404).json({ message: "Resume profile not found to update" });
      }

      // Compute structural diff changes
      changes = diffResumes(resume, parsedData);
      if (originalPdfName && resume.originalPdfName !== originalPdfName) {
        changes.push(`Uploaded new resume PDF: ${originalPdfName}`);
      }

      // Update resume
      Object.assign(resume, parsedData);
    } else {
      isNew = true;
      resume = new Resume({
        ...parsedData,
        user: req.user._id,
      });
    }

    // Attach PDF metadata & AI results
    resume.originalPdfData = originalPdfData || null;
    resume.originalPdfName = originalPdfName || null;
    resume.rawText = rawText || null;
    resume.atsScore = suggestions.atsScore || 70;
    resume.aiAnalysis = {
      score: suggestions.atsScore || 70,
      missingSkills: suggestions.missingSkills || [],
      improvements: suggestions.improvements || [],
    };
    resume.careerReadinessScore = suggestions.careerReadinessScore || 70;
    resume.recommendedInternships = suggestions.recommendedInternships || [];
    resume.recommendedCareerPaths = suggestions.recommendedCareerPaths || [];
    resume.completionPercentage = calculateCompletion(resume);

    await resume.save();

    // Increment version in ResumeVersion
    const lastVersionDoc = await ResumeVersion.findOne({ resume: resume._id }).sort({ version: -1 });
    const nextVer = lastVersionDoc ? lastVersionDoc.version + 1 : 1;

    await ResumeVersion.create({
      resume: resume._id,
      version: nextVer,
      title: resume.title,
      template: resume.template,
      personal: resume.personal,
      about: resume.about,
      skills: resume.skills,
      education: resume.education,
      experience: resume.experience,
      projects: resume.projects,
      certifications: resume.certifications,
      achievements: resume.achievements,
      languages: resume.languages,
      atsScore: resume.atsScore,
      aiAnalysis: resume.aiAnalysis,
      originalPdfData: resume.originalPdfData,
      originalPdfName: resume.originalPdfName,
      rawText: resume.rawText,
      careerReadinessScore: resume.careerReadinessScore,
      recommendedInternships: resume.recommendedInternships,
      recommendedCareerPaths: resume.recommendedCareerPaths,
      changesDetected: changes.length > 0 ? changes : ["Updated details"],
    });

    // Update corresponding User model profile fields
    const User = require("../models/User");
    await User.findByIdAndUpdate(req.user._id, {
      name: parsedData.personal?.fullName || req.user.name,
      location: parsedData.personal?.location || req.user.location,
      phone: parsedData.personal?.phone || req.user.phone,
      headline: parsedData.personal?.role || parsedData.title || req.user.headline,
      targetRole: parsedData.title || req.user.targetRole,
    });

    // Automatically initialize/update User's Career Advisor roadmap and skills
    const CareerAdvisor = require("../models/CareerAdvisor");
    let advisor = await CareerAdvisor.findOne({ user: req.user._id });
    if (!advisor) {
      advisor = new CareerAdvisor({ user: req.user._id });
    }

    const currentSkills = (parsedData.skills || []).map(s => typeof s === "string" ? s : s.name).filter(Boolean);

    advisor.targetRole = parsedData.title || suggestions.recommendedCareerPaths?.[0] || "";
    advisor.skillAnalysis = {
      currentSkills: currentSkills,
      missingSkills: (suggestions.missingSkills || []).map(sk => ({
        name: sk,
        priority: "high",
        reason: "Identified as missing from imported resume profile."
      })),
      completionPercentage: suggestions.careerReadinessScore || 70,
    };

    // Map recommended career paths to recommendations array
    advisor.recommendations = (suggestions.recommendedCareerPaths || []).map((path, idx) => ({
      careerPath: path,
      matchPercentage: idx === 0 ? 90 : idx === 1 ? 80 : 70,
      whyItMatches: `Matched based on technical and soft skills parsed from your uploaded resume.`,
      requiredSkills: currentSkills,
      missingSkills: suggestions.missingSkills || [],
      expectedGrowth: "High",
      difficultyLevel: "Medium",
      salaryRange: "$80,000 - $120,000",
      learningTimeline: "2-3 months",
    }));

    // Map projects
    advisor.projects = (parsedData.projects || []).map(p => ({
      title: p.name,
      description: p.description,
      difficulty: "intermediate",
      technologies: p.technologies || [],
      learningOutcome: ["Industry Application"],
      resumeImpact: "Parsed from existing resume",
      completed: true
    }));

    // Map certifications
    advisor.certifications = (parsedData.certifications || []).map(c => ({
      name: c.name,
      provider: c.issuer || "External",
      duration: "Self-paced",
      difficulty: "intermediate",
      benefits: "Parsed from existing resume",
      completed: true
    }));

    // Set tracker scores
    advisor.tracker = {
      skillsCompleted: currentSkills.length,
      projectsCompleted: (parsedData.projects || []).length,
      certificationsEarned: (parsedData.certifications || []).length,
      resumeStrength: suggestions.careerReadinessScore || 75,
      atsScore: suggestions.atsScore || 70,
      interviewReadiness: suggestions.careerReadinessScore || 75,
    };

    await advisor.save();

    res.json({
      message: isNew ? "Resume profile created successfully! ✅" : "Resume profile updated successfully! ✅",
      resume,
      changes,
    });
  } catch (error) {
    console.error("Save imported resume error:", error);
    res.status(500).json({ message: "Failed to save imported resume profile: " + error.message });
  }
};

// ==========================================
// @route   GET /api/resumes/:id/compare-versions
// @desc    Compare two versions of a resume structurally
// @access  Private
// ==========================================
const compareResumeVersions = async (req, res) => {
  try {
    const { versionIdA, versionIdB } = req.query;
    if (!versionIdA || !versionIdB) {
      return res.status(400).json({ message: "Both version IDs are required for comparison" });
    }

    const versionA = await ResumeVersion.findOne({ _id: versionIdA, resume: req.params.id });
    const versionB = await ResumeVersion.findOne({ _id: versionIdB, resume: req.params.id });

    if (!versionA || !versionB) {
      return res.status(404).json({ message: "One or both version snapshots not found" });
    }

    const changes = diffResumes(versionA, versionB);

    res.json({
      versionA: { version: versionA.version, createdAt: versionA.createdAt },
      versionB: { version: versionB.version, createdAt: versionB.createdAt },
      changesDetected: changes,
    });
  } catch (error) {
    console.error("Compare versions error:", error);
    res.status(500).json({ message: "Error comparing resume versions" });
  }
};

module.exports = {
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
};
