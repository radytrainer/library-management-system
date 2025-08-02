import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 🔐 Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.headers['Content-Type'] === 'multipart/form-data') {
    delete config.headers['Content-Type'];
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An error occurred.';
    if (error.response) {
      // Handle HTTP errors
      if (error.response.status === 404) {
        errorMessage = 'API endpoint not found (404). Please check the server configuration.';
      } else if (error.response.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.message.includes('Unexpected end of JSON input')) {
      errorMessage = 'Invalid server response. Please check the server logs.';
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;