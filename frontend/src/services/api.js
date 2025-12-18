import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000,
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
    
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    
    if (error.response?.status === 422) {
      return Promise.reject({
        ...error,
        validationErrors: error.response.data.errors
      });
    }
    
    return Promise.reject(error);
  }
);

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export const appointmentAPI = {
  create: (appointmentData) => api.post('/v1/appointments', appointmentData),
  getAll: () => api.get('/v1/appointments'),
  getStats: () => api.get('/v1/appointments/stats'),
  getById: (id) => api.get(`/v1/appointments/${id}`),
  updateStatus: (id, status) => api.put(`/v1/appointments/${id}/status`, { status })
};

export const healthAPI = {
  check: () => api.get('/health')
};

export default api;