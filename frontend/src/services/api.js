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
  withCredentials: true, // Important for session cookies
});

api.interceptors.request.use(
  (config) => {
    // Get CSRF token from cookie for state-changing requests
    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
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
    });
    
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - проверьте:');
      console.error('1. Запущен ли Laravel сервер?');
      console.error('2. Правильный ли порт? (должен быть 8000)');
      console.error('3. URL запроса:', error.config?.baseURL + error.config?.url);
    }
    
    if (error.response?.status === 401) {
      // Don't redirect on login/register pages
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
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

/**
 * Get CSRF cookie before making auth requests
 */
const getCsrfCookie = async () => {
  await axios.get(
    (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/sanctum/csrf-cookie',
    { withCredentials: true }
  );
};

// Auth API
export const authAPI = {
  register: async (data) => {
    await getCsrfCookie();
    return api.post('/v1/auth/register', data);
  },
  login: async (data) => {
    await getCsrfCookie();
    return api.post('/v1/auth/login', data);
  },
  logout: () => api.post('/v1/auth/logout'),
  me: () => api.get('/v1/auth/me'),
  updateProfile: (data) => api.put('/v1/auth/profile', data),
};

// Appointments API
export const appointmentAPI = {
  create: (appointmentData) => api.post('/v1/appointments', appointmentData),
  getAll: () => api.get('/v1/appointments'),
  getStats: () => api.get('/v1/appointments/stats'),
  getById: (id) => api.get(`/v1/appointments/${id}`),
  updateStatus: (id, status) => api.put(`/v1/appointments/${id}/status`, { status })
};

// Dashboard API (for clients)
export const dashboardAPI = {
  getMyAppointments: () => api.get('/v1/dashboard/my-appointments'),
  getMyStats: () => api.get('/v1/dashboard/my-stats'),
  getAppointment: (id) => api.get(`/v1/dashboard/appointments/${id}`),
  processPayment: (id, paymentMethod) => api.post(`/v1/dashboard/appointments/${id}/pay`, { payment_method: paymentMethod }),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/v1/admin/stats'),
  getAppointments: (params = {}) => api.get('/v1/admin/appointments', { params }),
  updateAppointmentStatus: (id, status) => api.put(`/v1/admin/appointments/${id}/status`, { status }),
  markPaymentComplete: (id) => api.post(`/v1/admin/appointments/${id}/mark-paid`),
  getClients: (params = {}) => api.get('/v1/admin/clients', { params }),
};

export const healthAPI = {
  check: () => api.get('/health')
};

export default api;
