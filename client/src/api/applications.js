import api from "./axios.js";

export const getApplicationsRequest = (params = {}) => api.get("/applications", { params });

export const getStatsRequest = () => api.get("/applications/stats");

export const createApplicationRequest = (data) => api.post("/applications", data);

export const updateApplicationRequest = (id, data) => api.patch(`/applications/${id}`, data);

export const deleteApplicationRequest = (id) => api.delete(`/applications/${id}`);
