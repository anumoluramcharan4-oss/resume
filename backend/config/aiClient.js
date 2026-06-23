// ==========================================
// config/aiClient.js — Unified OpenRouter AI Client
// ==========================================

const getAiModel = () => {
  return process.env.AI_MODEL || "nex-agi/nex-n2-pro:free";
};

const getApiKey = () => {
  return process.env.OPENROUTER_API_KEY || "";
};

const getModelList = () => {
  const primary = getAiModel();
  const fallbacks = [
    "nex-agi/nex-n2-pro:free",
    "cognitivecomputations/dolphin3.0-mistral-24b:free",
    "microsoft/phi-3.5-mini-128k-instruct:free"
  ];
  return [primary, ...fallbacks.filter(m => m !== primary)];
};

/**
 * Generate content using OpenRouter completions API
 * Matches the interface: { response: { text: () => text } }
 * @param {string} prompt - Text prompt.
 */
const generateContent = async (prompt) => {
  const apiKey = getApiKey();
  const models = getModelList();
  let lastError = null;

  for (const model of models) {
    console.log(`[AI Client] Trying model: ${model}...`);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 25000); // 25 seconds timeout per model

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://career.ai",
          "X-Title": "Career AI",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        clearTimeout(timeoutId);
        throw new Error(errorData?.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      clearTimeout(timeoutId);
      const text = data?.choices?.[0]?.message?.content || "";
      
      console.log(`[AI Client] Success with model: ${model}`);
      return {
        response: {
          text: () => text
        }
      };
    } catch (error) {
      console.warn(`[AI Client] Model ${model} failed:`, error.message);
      lastError = error;
    }
  }

  throw new Error("All OpenRouter models failed. Last error: " + lastError.message);
};

module.exports = {
  generateContent,
  getAiModel,
  getApiKey,
  getModelList
};
