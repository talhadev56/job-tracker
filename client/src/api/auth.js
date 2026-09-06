import api from "./axios.js";

export const registerRequest = (data) => api.post("/auth/register", data);

export const loginRequest = (data) => api.post("/auth/login", data);

export const getMeRequest = () => api.get("/auth/me");
