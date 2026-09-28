const fs = require('fs');
const path = require('path');

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

async function main() {
  try {
    const pdfPath = '../resume.pdf';
    console.log('Reading:', pdfPath);
    const buffer = fs.readFileSync(pdfPath);
    console.log('Buffer length:', buffer.length);
    const text = await extractPdfText(buffer);
    console.log('--- Extracted Text ---');
    console.log(text.slice(0, 1000));
    console.log('----------------------');
  } catch (err) {
    console.error('Error during extraction:', err);
  }
}

main();
