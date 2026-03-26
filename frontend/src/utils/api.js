// ─────────────────────────────────────────────────────────────
//  utils/api.js  –  Pre-configured Axios instance
// ─────────────────────────────────────────────────────────────
import axios from "axios";

// Use VITE_API_BASE_URL in production; fall back to Vite proxy in dev
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";


const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 30000, // 30 seconds
});

// ── Request interceptor: attach JWT if present ─────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ags_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: surface error messages cleanly ───
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;
