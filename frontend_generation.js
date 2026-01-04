/**
 * Service de génération de texte - VERSION CORRIGÉE
 * Gère les appels API pour la génération IA
 */

import api from "./api";

export const generationService = {
  /**
   * Génération de texte générique
   * @param {string} prompt - Le prompt à envoyer
   * @param {string|null} context - Contexte optionnel
   * @param {number} maxTokens - Nombre max de tokens
   * @returns {Promise<{text: string, tokens_used: number}>}
   */
  generateText: async (prompt, context = null, maxTokens = 2000) => {
    const response = await api.post("/generation/text", {
      prompt,
      context,
      max_tokens: maxTokens,
    });
    return response.data;
  },

  /**
   * Continuer un texte existant
   * @param {string} text - Le texte à continuer
   * @param {number} maxTokens - Nombre max de tokens
   * @returns {Promise<{text: string, tokens_used: number}>}
   */
  continueText: async (text, maxTokens = 500) => {
    const response = await api.post("/generation/continue", {
      text,
      max_tokens: maxTokens,
    });
    return response.data;
  },

  /**
   * Améliorer un texte existant
   * @param {string} text - Le texte à améliorer
   * @param {string} instruction - Instructions d'amélioration
   * @returns {Promise<{text: string, tokens_used: number}>}
   */
  improveText: async (text, instruction = "Améliore ce texte") => {
    const response = await api.post("/generation/improve", {
      text,
      instruction,
    });
    return response.data;
  },

  /**
   * Générer un plan de chapitres pour un projet
   * @param {string} projectId - ID du projet
   * @param {string} userId - ID de l'utilisateur
   * @param {number} numChapters - Nombre de chapitres à générer
   * @returns {Promise<Array>} - Liste des chapitres créés
   */
  generatePlan: async (projectId, userId, numChapters = 10) => {
    const response = await api.post(`/generation/plan?user_id=${userId}`, {
      project_id: projectId,
      num_chapters: numChapters,
    });
    return response.data;
  },

  /**
   * Générer ou continuer le contenu d'un chapitre
   * @param {string} chapterId - ID du chapitre
   * @param {string} userId - ID de l'utilisateur
   * @param {string|null} instruction - Instructions optionnelles
   * @returns {Promise<string>} - Le texte généré
   */
  writeChapter: async (chapterId, userId, instruction = null) => {
    const response = await api.post(`/generation/chapter?user_id=${userId}`, {
      chapter_id: chapterId,
      instruction,
    });
    return response.data.generated_text;
  },
};
