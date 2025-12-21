import api from "./api";

export const generationService = {
  generateText: async (prompt, context, maxTokens = 2000) => {
    const response = await api.post("/generation/text", {
      prompt,
      context,
      max_tokens: maxTokens,
    });
    return response.data;
  },

  continueText: async (text, maxTokens = 500) => {
    const response = await api.post("/generation/continue", null, {
      params: { text, max_tokens: maxTokens },
    });
    return response.data;
  },

  improveText: async (text, instruction) => {
    const response = await api.post("/generation/improve", null, {
      params: { text, instruction },
    });
    return response.data;
  },
};
