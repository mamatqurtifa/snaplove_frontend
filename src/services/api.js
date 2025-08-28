import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  // Do not set a global 'Content-Type' here; let Axios decide based on payload
  headers: {
    'Accept': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  // If sending FormData, ensure Content-Type is unset so browser sets proper multipart boundary
  if (config.data instanceof FormData) {
    if (config.headers['Content-Type']) {
      delete config.headers['Content-Type'];
    }
  } else if (config.headers && !config.headers['Content-Type']) {
    // Default JSON only when not FormData and caller hasn't specified
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

export default api;