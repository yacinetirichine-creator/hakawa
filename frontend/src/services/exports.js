import api from "./api";

export const exportsService = {
  create: async (projectId, format) => {
    const normalized = (format || "").toLowerCase();

    if (normalized === "pdf") {
      const response = await api.post(`/exports/pdf/${projectId}`);
      return response.data;
    }

    if (normalized === "epub") {
      const response = await api.post(`/exports/epub/${projectId}`);
      return response.data;
    }

    if (normalized === "kdp" || normalized === "full_kdp") {
      const response = await api.post(`/exports/kdp-package/${projectId}`);
      return response.data;
    }

    throw new Error("Unsupported export format");
  },

  download: async (exportId) => {
    // Will return a FileResponse (blob) for local exports
    const response = await api.get(`/exports/download/${exportId}`, {
      responseType: "blob",
    });
    return response;
  },

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
