import axios from 'axios';
import { API_BASE_URL } from '@/constants/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    // Get token from storage if available
    const token = global.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally (e.g., redirect to login on 401)
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
      // Redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);

export default api;