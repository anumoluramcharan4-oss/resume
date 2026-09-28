// ==========================================
// backend/services/pdfParser.js
// ==========================================
// Service for extracting text from PDF buffers and cleaning it.

const extractPdfRawText = async (pdfBuffer) => {
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

const cleanExtractedText = (text) => {
  if (!text) return "";

  // Split into lines
  const lines = text.split(/\r?\n/);
  const cleanedLines = [];
  const seenLines = new Set();

  for (let line of lines) {
    // 1. Collapse multiple spaces into single space, trim
    let cleanLine = line.replace(/\s+/g, " ").trim();

    if (!cleanLine) continue;

    // 2. Remove page numbers (e.g., "Page 1", "1 of 2", "1", "[1]")
    if (/^(page\s+\d+|\d+\s*of\s*\d+|\d+|\[\d+\])$/i.test(cleanLine)) {
      continue;
    }

    // 3. Remove common headers/footers/generic labels
    if (/^(resume|curriculum vitae|cv|page\s*\d+\s*of\s*\d+)$/i.test(cleanLine)) {
      continue;
    }

    // 4. Remove duplicate lines to save prompt token space
    const normalizedLine = cleanLine.toLowerCase();
    if (seenLines.has(normalizedLine)) {
      continue;
    }
    seenLines.add(normalizedLine);

    cleanedLines.push(cleanLine);
  }

  return cleanedLines.join("\n");
};

const parsePdf = async (pdfBuffer) => {
  const rawText = await extractPdfRawText(pdfBuffer);
  const cleanedText = cleanExtractedText(rawText);
  return { rawText, cleanedText };
};

module.exports = {
  extractPdfRawText,
  cleanExtractedText,
  parsePdf
};
