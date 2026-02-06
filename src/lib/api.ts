import axios from 'axios';

// 1. POINT DIRECTLY TO HUGGING FACE
const API_URL = 'https://aminesidki-postprep.hf.space/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // CRITICAL: This sends the HttpOnly Cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401, it means the Cookie is missing or the Backend rejected it.
    if (error.response?.status === 401) {
      console.error("🔒 401 Unauthorized - Redirecting to login");
      
      // Stop the infinite loop: Only redirect if not already there
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('postprep_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
