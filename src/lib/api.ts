;import axios from 'axios';

// Relative path ensures it works with both Vite Proxy (Local) and Vercel Rewrites (Prod)
const API_URL = '/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest._retry) return Promise.reject(error);
    
    if (error.response?.status === 401) {
      originalRequest._retry = true;
      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('postprep_user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
