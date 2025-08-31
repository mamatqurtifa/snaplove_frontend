import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'x-api-key': API_KEY // Add the API key to all requests
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
  
  // Ensure API key is always present
  if (!config.headers['x-api-key'] && API_KEY) {
    config.headers['x-api-key'] = API_KEY;
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