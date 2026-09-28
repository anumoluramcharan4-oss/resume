// ==========================================
// backend/services/promptBuilder.js
// ==========================================
// Service for constructing specialized AI prompts.

const buildResumeParsePrompt = (cleanedText) => {
  return `You are a professional ATS resume parsing system and expert career advisor.
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
        "current": false,
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
${cleanedText}`;
};

module.exports = {
  buildResumeParsePrompt
};
