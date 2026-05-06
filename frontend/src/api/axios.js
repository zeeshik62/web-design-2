import axios from 'axios';

// The base URL depends on the Vite proxy settings. 
// We configured Vite to proxy /api to http://localhost:5000
const api = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the correct JWT token
api.interceptors.request.use(
  (config) => {
    // Determine which token to use based on the URL
    // Owner routes start with /hall_owner
    let token = null;
    if (config.url.includes('/hall_owner')) {
      token = localStorage.getItem('owner_token');
    } else {
      // Default to customer token for all other requests
      token = localStorage.getItem('customer_token');
    }

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
      console.error('Unauthorized request. Token may be expired.');
    }
    return Promise.reject(error);
  }
);

export default api;
