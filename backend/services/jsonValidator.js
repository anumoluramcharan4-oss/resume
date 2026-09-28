// ==========================================
// backend/services/jsonValidator.js
// ==========================================
// Service for parsing, cleaning, and repairing JSON output from AI models.

const createDefaultSchema = () => {
  return {
    parsedData: {
      title: "Software Engineer",
      template: "modern",
      personal: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        portfolio: "",
        twitter: ""
      },
      about: "",
      skills: [],
      education: [],
      experience: [],
      projects: [],
      certifications: [],
      achievements: [],
      languages: []
    },
    suggestions: {
      missingSkills: [],
      improvements: [],
      atsScore: 70,
      careerReadinessScore: 70,
      recommendedInternships: [],
      recommendedCareerPaths: []
    }
  };
};

const validateAndRepairJson = (rawText) => {
  if (!rawText) return createDefaultSchema();

  let cleaned = rawText.trim();

  // Strip markdown formatting if the model wrapped it in code blocks
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "").replace(/\s*```$/, "");
  }
  cleaned = cleaned.trim();

  // Find start and end braces to isolate JSON content
  const startIdx = cleaned.indexOf("{");
  const endIdx = cleaned.lastIndexOf("}");

  if (startIdx === -1 || endIdx === -1) {
    console.error("[JSON Validator] Could not find root JSON braces. Returning default.");
    return createDefaultSchema();
  }

  cleaned = cleaned.substring(startIdx, endIdx + 1);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.warn("[JSON Validator] Standard JSON parse failed. Attempting basic syntax repair.", error.message);
    
    try {
      // 1. Remove trailing commas before closing braces/brackets
      let repaired = cleaned
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]");

      // 2. Escape unescaped control characters in JSON values (like literal newlines)
      repaired = repaired.replace(/"([^"]*)":\s*"([^"]*)"/g, (match, key, val) => {
        const escapedVal = val.replace(/\r?\n/g, "\\n").replace(/"/g, '\\"');
        return `"${key}": "${escapedVal}"`;
      });

      return JSON.parse(repaired);
    } catch (repairError) {
      console.error("[JSON Validator] Automatic repair failed. Returning default fallback structure.", repairError.message);
      
      const defaultSchema = createDefaultSchema();
      // Try to save whatever readable content we can salvage (or just use default)
      return defaultSchema;
    }
  }
};

module.exports = {
  validateAndRepairJson,
  createDefaultSchema
};
