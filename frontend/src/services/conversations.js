import api from "./api";

export const conversationsService = {
  get: async (projectId, userId) => {
    const response = await api.get(
      `/conversations/${projectId}?user_id=${userId}`
    );
    return response.data;
  },

  sendMessage: async (projectId, content, userId) => {
    const response = await api.post(
      `/conversations/${projectId}/message?user_id=${userId}`,
      { content }
    );
    return response.data;
  },

  updatePhase: async (projectId, phase, userId) => {
    const response = await api.put(
      `/conversations/${projectId}/phase?user_id=${userId}&phase=${phase}`
    );
    return response.data;
  },

  clear: async (projectId, userId) => {
    const response = await api.delete(
      `/conversations/${projectId}?user_id=${userId}`
    );
    return response.data;
  },
};
