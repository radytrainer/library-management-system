import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
      console.log('Token included in request:', user.token.substring(0, 10) + '...');
    } else {
      console.warn('No token found in user object for request:', config.url);
    }
  } else {
    console.warn('No user object found in localStorage for request:', config.url);
  }
  return config;
}, (error) => {
  console.error('Axios request interceptor error:', error);
  return Promise.reject(error);
});

export default instance;