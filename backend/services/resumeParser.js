// ==========================================
// backend/services/resumeParser.js
// ==========================================
// Coordinator service for resume PDF extraction and structured parsing.

const { parsePdf } = require("./pdfParser");
const { buildResumeParsePrompt } = require("./promptBuilder");
const { generateContent } = require("./aiClient");
const { validateAndRepairJson } = require("./jsonValidator");

/**
 * Coordinate PDF loading, text extraction, cleaning, prompt creation,
 * LLM querying, and JSON verification.
 * 
 * @param {string} base64PdfData - Base64 encoded PDF string
 * @returns {Promise<object>} Structured parsed resume fields, suggestions, and raw text
 */
const parseResumePdf = async (base64PdfData) => {
  if (!base64PdfData) {
    throw new Error("PDF base64 data is required");
  }

  // 1. Decode base64 to buffer
  let cleanBase64 = base64PdfData;
  if (cleanBase64.startsWith("data:")) {
    cleanBase64 = cleanBase64.split(",")[1];
  }
  const pdfBuffer = Buffer.from(cleanBase64, "base64");

  // 2. Parse PDF and clean text
  console.log("[Resume Parser] Extracting text from PDF buffer...");
  const { rawText, cleanedText } = await parsePdf(pdfBuffer);
  
  if (!cleanedText || cleanedText.length < 10) {
    throw new Error("Unable to extract readable text content from the uploaded PDF resume. Please ensure it is not scanned/image-only.");
  }

  // 3. Build detailed instruction prompt
  console.log("[Resume Parser] Building prompt...");
  const prompt = buildResumeParsePrompt(cleanedText);

  // 4. Query OpenRouter models
  console.log("[Resume Parser] Sending prompt to AI models...");
  const aiResult = await generateContent(prompt);
  const textResult = aiResult.response.text();

  // 5. Validate and repair JSON response
  console.log("[Resume Parser] Validating and parsing AI output...");
  const structuredData = validateAndRepairJson(textResult);

  // Attach raw text for indexing/database searches
  structuredData.rawText = rawText;

  return structuredData;
};

module.exports = {
  parseResumePdf
};
