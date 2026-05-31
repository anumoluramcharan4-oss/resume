// ==========================================
// src/services/api.js — Axios API Client
// ==========================================
// Centralized HTTP client.
// All API calls go through this instance.
// It auto-attaches the JWT token to every request.

import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "/api", // Uses Vite proxy to talk to backend at localhost:5000
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — redirect to login
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
