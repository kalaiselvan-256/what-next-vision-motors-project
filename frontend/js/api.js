/**
 * WhatNext Vision Motors - Central API Client & Utilities
 */

const API_BASE = '/api';

// Format Currency
const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    amount = Number(amount) || 0;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format Date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Auth Storage Helpers
const getStoredToken = () => localStorage.getItem('wn_auth_token');
const getStoredUser = () => {
  try {
    const u = localStorage.getItem('wn_auth_user');
    return u ? JSON.parse(u) : null;
  } catch (e) {
    return null;
  }
};
const setAuthData = (token, user) => {
  localStorage.setItem('wn_auth_token', token);
  localStorage.setItem('wn_auth_user', JSON.stringify(user));
};
const clearAuthData = () => {
  localStorage.removeItem('wn_auth_token');
  localStorage.removeItem('wn_auth_user');
};

// Toast Notifications System
const showToast = (title, message = '', type = 'info') => {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || 'ℹ'}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-message">${message}</div>` : ''}
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
};

// Generic HTTP Request Handler
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const config = {
      ...options,
      headers,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err.message);
    throw err;
  }
};

// API Services
const authAPI = {
  register: (body) => apiRequest('/auth/register', { method: 'POST', body }),
  login: (body) => apiRequest('/auth/login', { method: 'POST', body }),
  getMe: () => apiRequest('/auth/me', { method: 'GET' }),
  updateProfile: (body) => apiRequest('/auth/profile', { method: 'PUT', body }),
};

const vehiclesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return apiRequest(`/vehicles?${query.toString()}`, { method: 'GET' });
  },
  getFeatured: () => apiRequest('/vehicles/featured', { method: 'GET' }),
  getFilters: () => apiRequest('/vehicles/filters', { method: 'GET' }),
  getById: (id) => apiRequest(`/vehicles/${id}`, { method: 'GET' }),
  create: (body) => apiRequest('/vehicles', { method: 'POST', body }),
  update: (id, body) => apiRequest(`/vehicles/${id}`, { method: 'PUT', body }),
  delete: (id) => apiRequest(`/vehicles/${id}`, { method: 'DELETE' }),
};

const bookingsAPI = {
  create: (body) => apiRequest('/bookings', { method: 'POST', body }),
  getMyBookings: () => apiRequest('/bookings/my-bookings', { method: 'GET' }),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/bookings${query ? '?' + query : ''}`, { method: 'GET' });
  },
  updateStatus: (id, body) => apiRequest(`/bookings/${id}/status`, { method: 'PUT', body }),
  delete: (id) => apiRequest(`/bookings/${id}`, { method: 'DELETE' }),
};

const contactAPI = {
  submit: (body) => apiRequest('/contact', { method: 'POST', body }),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/contact${query ? '?' + query : ''}`, { method: 'GET' });
  },
  updateStatus: (id, body) => apiRequest(`/contact/${id}`, { method: 'PUT', body }),
  delete: (id) => apiRequest(`/contact/${id}`, { method: 'DELETE' }),
};

const adminAPI = {
  getStats: () => apiRequest('/admin/stats', { method: 'GET' }),
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users${query ? '?' + query : ''}`, { method: 'GET' });
  },
  updateUserRole: (id, role) => apiRequest(`/admin/users/${id}/role`, { method: 'PUT', body: { role } }),
  deleteUser: (id) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' }),
};

window.WN_API = {
  formatCurrency,
  formatDate,
  getStoredToken,
  getStoredUser,
  setAuthData,
  clearAuthData,
  showToast,
  auth: authAPI,
  vehicles: vehiclesAPI,
  bookings: bookingsAPI,
  contact: contactAPI,
  admin: adminAPI,
};
