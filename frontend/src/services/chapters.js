import api from "./api";

export const chaptersService = {
  getAll: async (projectId, userId) => {
    const response = await api.get(
      `/projects/${projectId}/chapters?user_id=${userId}`
    );
    return response.data;
  },

  getOne: async (projectId, chapterNumber, userId) => {
    const response = await api.get(
      `/projects/${projectId}/chapters/${chapterNumber}?user_id=${userId}`
    );
    return response.data;
  },

  create: async (projectId, chapterData, userId) => {
    const response = await api.post(
      `/projects/${projectId}/chapters?user_id=${userId}`,
      chapterData
    );
    return response.data;
  },

  update: async (projectId, chapterNumber, chapterData, userId) => {
    const response = await api.put(
      `/projects/${projectId}/chapters/${chapterNumber}?user_id=${userId}`,
      chapterData
    );
    return response.data;
  },

  delete: async (projectId, chapterNumber, userId) => {
    const response = await api.delete(
      `/projects/${projectId}/chapters/${chapterNumber}?user_id=${userId}`
    );
    return response.data;
  },
};
