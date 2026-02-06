import axios from 'axios';

// CHANGE THIS: Use a relative path. 
// Vite will see '/api' and forward it to Hugging Face automatically.
const API_URL = '/api/v1'; 

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This allows the browser to send the cookie through the tunnel
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("🔒 401 Unauthorized - Session Expired");
      // Only redirect if we are strictly not on login to prevent loops
      if (!window.location.pathname.includes('/login')) {
         // distinct from a hard reload, this lets us keep state if needed, 
         // but usually, 401 means we must login again.
         // localStorage.removeItem('postprep_user');
         // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
