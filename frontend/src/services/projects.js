import api from "./api";

export const projectsService = {
  getAll: async (userId) => {
    const response = await api.get(`/projects?user_id=${userId}`);
    return response.data;
  },

  getOne: async (projectId, userId) => {
    const response = await api.get(`/projects/${projectId}?user_id=${userId}`);
    return response.data;
  },

  create: async (projectData, userId) => {
    const response = await api.post(`/projects?user_id=${userId}`, projectData);
    return response.data;
  },

  update: async (projectId, projectData, userId) => {
    const response = await api.put(
      `/projects/${projectId}?user_id=${userId}`,
      projectData
    );
    return response.data;
  },

  delete: async (projectId, userId) => {
    const response = await api.delete(
      `/projects/${projectId}?user_id=${userId}`
    );
    return response.data;
  },
};
