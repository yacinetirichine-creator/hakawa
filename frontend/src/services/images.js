import api from "./api";

export const imagesService = {
  getAll: async (projectId, userId) => {
    const response = await api.get(
      `/images/${projectId}/illustrations?user_id=${userId}`
    );
    return response.data;
  },

  generate: async (projectId, prompt, style, userId) => {
    const response = await api.post(
      `/images/${projectId}/illustrations?user_id=${userId}`,
      {
        prompt,
        style,
      }
    );
    return response.data;
  },

  setCover: async (projectId, illustrationId, position, userId) => {
    const response = await api.put(
      `/images/${projectId}/cover/${position}?illustration_id=${illustrationId}&user_id=${userId}`
    );
    return response.data;
  },

  delete: async (illustrationId, userId) => {
    const response = await api.delete(
      `/images/illustrations/${illustrationId}?user_id=${userId}`
    );
    return response.data;
  },
};
