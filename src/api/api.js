import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Service APIs
export const serviceAPI = {
  getServices: () => api.get('/services'),
};

// Booking APIs
export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getBooking: (id) => api.get(`/bookings/${id}`),
};

// Provider APIs
export const providerAPI = {
  createService: (data) => api.post('/provider/services', data),
  getMyServices: () => api.get('/provider/services'),
  getAssignedBookings: () => api.get('/provider/bookings'),
  acceptBooking: (id) => api.post(`/provider/bookings/${id}/accept`),
  rejectBooking: (id) => api.post(`/provider/bookings/${id}/reject`),
};

// Admin APIs
export const adminAPI = {
  getAllBookings: () => api.get('/admin/bookings'),
  overrideBooking: (id, data) => api.post(`/admin/bookings/${id}/override`, data),
};

// Payment APIs
export const paymentAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
};

export default api;
