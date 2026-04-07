// =============================================
// src/utils/api.js - Axios Instance Configuration
// =============================================

import axios from 'axios';

// Create an Axios instance with base URL pointing to our backend
const api = axios.create({
  baseURL: '/api', // Uses Vite proxy in development (see vite.config.js)
});

// Request Interceptor: Attach JWT token to every request automatically
// This means we don't have to manually add headers in every API call
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized globally
// If the token is expired or invalid, log the user out automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
