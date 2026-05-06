import axios from 'axios';

// The base URL depends on the Vite proxy settings. 
// We configured Vite to proxy /api to http://localhost:5000
const api = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token might be expired or invalid
      // We can clear localStorage here or handle it in AuthContext
      console.error('Unauthorized request. Token may be expired.');
      // Optional: you could force a logout here if you imported AuthContext
    }
    return Promise.reject(error);
  }
);

export default api;
