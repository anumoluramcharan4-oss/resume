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

// Response interceptor — pass errors through
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
