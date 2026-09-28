// ==========================================
// backend/config/aiClient.js
// ==========================================
// Unified OpenRouter AI Client mapping to Services layer.

const aiClientService = require("../services/aiClient");

module.exports = {
  generateContent: aiClientService.generateContent,
  getAiModel: aiClientService.getAiModel,
  getApiKey: aiClientService.getApiKey,
  getModelList: aiClientService.getModelList,
  getGenerativeModel: aiClientService.getGenerativeModel
};
