// ==========================================
// backend/services/aiClient.js
// ==========================================
// Service for querying OpenRouter AI models with automatic model failover/fallbacks.

const getAiModel = () => {
  return process.env.AI_MODEL || "google/gemma-3-27b-it";
};

const getApiKey = () => {
  return process.env.OPENROUTER_API_KEY || "";
};

const getModelList = () => {
  const primary = getAiModel();
  const fallbacks = [
    "meta-llama/llama-3.3-70b-instruct",
    "deepseek/deepseek-chat",
    "qwen/qwen-2.5-72b-instruct",
    "google/gemma-2-9b-it:free",
    "qwen/qwen-2.5-7b-instruct:free",
    "meta-llama/llama-3.1-8b-instruct:free"
  ];
  // Filter out any duplicates and return the prioritized list
  return [primary, ...fallbacks.filter(m => m !== primary)];
};

const generateContent = async (prompt) => {
  const apiKey = getApiKey();
  const models = getModelList();
  let lastError = null;

  if (!apiKey) {
    throw new Error("OpenRouter API key is missing. Please check your backend .env file.");
  }

  for (const model of models) {
    console.log(`[AI Service] Attempting request with model: ${model}`);
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
        throw new Error(errorData?.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      clearTimeout(timeoutId);
      const text = data?.choices?.[0]?.message?.content || "";
      
      if (!text) {
        throw new Error("Received empty response content from model");
      }

      console.log(`[AI Service] Successfully generated content using model: ${model}`);
      return {
        response: {
          text: () => text
        }
      };
    } catch (error) {
      console.warn(`[AI Service] Model ${model} failed:`, error.message);
      lastError = error;
    }
  }

  // All models failed. Throw user-friendly error details
  throw new Error("Unable to analyze resume. Reason: OpenRouter service unavailable. Please try again later. (Last log: " + lastError.message + ")");
};

// Return a shim matching the Google Generative AI syntax to remain backward compatible
const getGenerativeModel = () => {
  return {
    generateContent
  };
};

module.exports = {
  generateContent,
  getAiModel,
  getApiKey,
  getModelList,
  getGenerativeModel
};
