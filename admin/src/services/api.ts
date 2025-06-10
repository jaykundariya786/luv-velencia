import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.');
    } else if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('adminToken');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/admin/login', credentials),
  verifyToken: () => api.get('/admin/verify'),
  logout: () => api.post('/admin/logout'),
};

// Users API
export const usersAPI = {
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getFirebaseUsers: (params?: any) => api.get('/admin/firebase-users', { params }),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  toggleUserStatus: (id: string) => api.patch(`/admin/users/${id}/toggle-status`),
  updateUserStatus: (id: string, data: { isActive: boolean }) => api.put(`/admin/users/${id}/status`, data),
};

// Products API
export const productsAPI = {
  getProducts: (params?: any) => api.get('/admin/products', { params }),
  getProduct: (id: string) => api.get(`/admin/products/${id}`),
  createProduct: (data: any) => api.post('/admin/products', data),
  updateProduct: (id: string, data: any) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  getCategories: () => api.get('/admin/products/categories'),
  updateProductStock: (id: string, data: { stock: number; lowStockThreshold?: number }) =>
    api.put(`/admin/products/${id}/stock`, data),
  getLowStockAlerts: () =>
    api.get('/admin/alerts/low-stock'),

  // Product variants
  createProductVariant: (productId: string, data: any) => 
    api.post(`/admin/products/${productId}/variants`, data),
  updateProductVariant: (productId: string, variantId: string, data: any) => 
    api.put(`/admin/products/${productId}/variants/${variantId}`, data),
  deleteProductVariant: (productId: string, variantId: string) => 
    api.delete(`/admin/products/${productId}/variants/${variantId}`),
  getProductVariants: (productId: string) => 
    api.get(`/admin/products/${productId}/variants`),

  // Image management
  uploadImages: (productId: string | undefined, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    if (productId) formData.append('productId', productId);
    return api.post('/admin/products/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  reorderImages: (productId: string, imageOrder: string[]) => 
    api.put(`/admin/products/${productId}/images/reorder`, { imageOrder }),
  setCoverImage: (productId: string, imageIndex: number) => 
    api.put(`/admin/products/${productId}/images/cover`, { imageIndex }),
  deleteImage: (productId: string, imageUrl: string) => 
    api.delete(`/admin/products/${productId}/images`, { data: { imageUrl } }),
};

// Orders API
export const ordersAPI = {
  getOrders: (params?: any) => api.get('/admin/orders', { params }),
  getOrder: (id: string) => api.get(`/admin/orders/${id}`),
  updateOrder: (id: string, data: any) => api.put(`/admin/orders/${id}`, data),
  updateOrderStatus: (id: string, status: string, trackingNumber?: string) => 
    api.put(`/admin/orders/${id}/status`, { status, trackingNumber }),
  generateBill: (id: string) => {
    return api.get(`/admin/orders/${id}/bill`, {
      responseType: 'blob', // For PDF download
    });
  },
  deleteOrder: (id: string) => api.delete(`/admin/orders/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/admin/analytics'),
};

// Discounts API
export const discountsAPI = {
  getDiscounts: (params?: any) => api.get('/admin/discounts', { params }),
  getDiscount: (id: string) => api.get(`/admin/discounts/${id}`),
  createDiscount: (data: any) => api.post('/admin/discounts', data),
  updateDiscount: (id: string, data: any) => api.put(`/admin/discounts/${id}`, data),
  deleteDiscount: (id: string) => api.delete(`/admin/discounts/${id}`),
};

// Coupons API
export const couponsAPI = {
  getCoupons: (params?: any) => api.get('/admin/coupons', { params }),
  getCoupon: (id: string) => api.get(`/admin/coupons/${id}`),
  createCoupon: (data: any) => api.post('/admin/coupons', data),
  updateCoupon: (id: string, data: any) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id: string) => api.delete(`/admin/coupons/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getSalesAnalytics: (params?: any) => api.get('/admin/analytics/sales', { params }),
  getReports: (params?: any) => api.get('/admin/reports', { params }),
  generateReport: (data: any) => api.post('/admin/reports/generate', data),
  downloadReport: (id: string) => api.get(`/admin/reports/${id}/download`, {
    responseType: 'blob', // For file download
  }),
  deleteReport: (id: string) => api.delete(`/admin/reports/${id}`),
};

// Multi-currency APIs

// Get exchange rates
export const currencyAPI = {
  getExchangeRates: () => api.get('/admin/currencies/rates'),
  updateExchangeRates: (rates: any) => api.put('/admin/currencies/rates', { rates }),
  convertCurrency: (amount: number, fromCurrency: string, toCurrency: string) => 
    api.post('/admin/currencies/convert', { amount, fromCurrency, toCurrency }),
};

// Settings API
export const settingsAPI = {
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.put('/admin/settings', data),
  togglePlugin: (pluginId: string, enabled: boolean) => 
    api.put(`/admin/settings/plugins/${pluginId}`, { enabled }),
  uploadLogo: (file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    return api.post('/admin/settings/logo/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export default api;