import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (!config.url.includes('/auth/signin') && !config.url.includes('/auth/signup')) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Optional debug log:
      // console.log('Token added to request:', token.substring(0, 10) + '...');
    } else {
      console.warn(`No token found for request: ${config.url}`);
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
