import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 10000,
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
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
      message: error.message,
      fullError: error
    });
    
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - проверьте:');
      console.error('1. Запущен ли Laravel сервер?');
      console.error('2. Правильный ли порт? (должен быть 8000)');
      console.error('3. URL запроса:', error.config?.baseURL + error.config?.url);
    }
    
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
    
    if (error.response?.status === 500) {
      console.error('Server 500 error details:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
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