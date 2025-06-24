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
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 307) {
      const redirectUrl = error.response.headers.location;
      console.log('Redirect detected:', redirectUrl);
      if (redirectUrl?.startsWith('http://')) {
        console.warn('Rewriting HTTP redirect to HTTPS:', redirectUrl);
        const httpsUrl = redirectUrl.replace('http://', 'https://');
        return api.request({
          ...error.config,
          url: httpsUrl.replace(baseURL, ''),
          baseURL,
        });
      }
    }
    console.error('Axios Error:', {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      message: error.message,
    });
    return Promise.reject(error);
  }
);
export default api;
