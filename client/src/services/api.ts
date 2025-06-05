
import axios from 'axios';
import { type Product } from '@shared/schema';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('user');
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    // Mock implementation - replace with actual API call
    const mockUser = {
      id: '1',
      email,
      name: email.split('@')[0],
      provider: 'email' as const
    };
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUser), 1000);
    });
  },

  signup: async (email: string, password: string, name: string) => {
    // Mock implementation - replace with actual API call
    const mockUser = {
      id: '1',
      email,
      name,
      provider: 'email' as const
    };
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUser), 1000);
    });
  },

  loginWithGoogle: async () => {
    // Mock implementation - replace with actual Google OAuth
    const mockUser = {
      id: '2',
      email: 'user@gmail.com',
      name: 'Google User',
      provider: 'google' as const
    };
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUser), 1000);
    });
  },

  loginWithApple: async () => {
    // Mock implementation - replace with actual Apple Sign In
    const mockUser = {
      id: '3',
      email: 'user@icloud.com',
      name: 'Apple User',
      provider: 'apple' as const
    };
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUser), 1000);
    });
  },
};

// Products API
export const productsAPI = {
  getProducts: async (filters?: {
    category?: string;
    line?: string;
    sort?: string;
    search?: string;
    colors?: string[];
    materials?: string[];
  }): Promise<Product[]> => {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append("category", filters.category);
    if (filters?.line) params.append("line", filters.line);
    if (filters?.sort) params.append("sort", filters.sort);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.colors && filters.colors.length > 0) {
      params.append("colors", filters.colors.join(","));
    }
    if (filters?.materials && filters.materials.length > 0) {
      params.append("materials", filters.materials.join(","));
    }

    const queryString = params.toString();
    const url = `/products${queryString ? `?${queryString}` : ""}`;
    
    return api.get(url);
  },

  getProduct: async (id: number): Promise<Product> => {
    return api.get(`/products/${id}`);
  },

  getSavedItems: async (): Promise<Product[]> => {
    return api.get('/saved-items');
  },

  getRecentlyViewed: async (): Promise<Product[]> => {
    return api.get('/recently-viewed');
  },
};

export default api;
