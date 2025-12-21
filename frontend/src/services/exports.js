import api from "./api";

export const exportsService = {
  getAll: async (projectId, userId) => {
    const response = await api.get(`/exports/${projectId}?user_id=${userId}`);
    return response.data;
  },

  generatePdf: async (projectId, userId) => {
    const response = await api.post(
      `/exports/pdf/${projectId}?user_id=${userId}`
    );
    return response.data;
  },

  generateEpub: async (projectId, userId) => {
    const response = await api.post(
      `/exports/epub/${projectId}?user_id=${userId}`
    );
    return response.data;
  },

  generateKdp: async (projectId, userId) => {
    const response = await api.post(
      `/exports/kdp-package/${projectId}?user_id=${userId}`
    );
    return response.data;
  },

  getStatus: async (exportId, userId) => {
    const response = await api.get(
      `/exports/status/${exportId}?user_id=${userId}`
    );
    return response.data;
  },

  getDownloadUrl: async (exportId, userId) => {
    const response = await api.get(
      `/exports/download/${exportId}?user_id=${userId}`
    );
    return response.data;
  },
};
