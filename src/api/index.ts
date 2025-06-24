import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL.startsWith('http')
  ? import.meta.env.VITE_API_BASE_URL.replace('http://', 'https://')
  : import.meta.env.VITE_API_BASE_URL;

console.log("Using API Base URL:", baseURL);

const api = axios.create({
  baseURL,
});
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
