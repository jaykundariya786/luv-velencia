
import axios from 'axios';
import { type Product } from '@shared/schema';
import { logout } from '../store/slices/authSlice';
import { store } from '../store';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const user = state.auth.user;
    
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - dispatch logout action
      store.dispatch(logout());
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    // Mock implementation - replace with actual API call
    return new Promise<{
      id: string;
      email: string;
      name: string;
      provider: 'email';
      token: string;
    }>((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          resolve({
            id: Date.now().toString(),
            email,
            name: email.split('@')[0],
            provider: 'email',
            token: `token_${Date.now()}`
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },

  signup: async (email: string, password: string, name: string) => {
    // Mock implementation - replace with actual API call
    return new Promise<{
      id: string;
      email: string;
      name: string;
      provider: 'email';
      token: string;
    }>((resolve, reject) => {
      setTimeout(() => {
        if (email && password && name) {
          resolve({
            id: Date.now().toString(),
            email,
            name,
            provider: 'email',
            token: `token_${Date.now()}`
          });
        } else {
          reject(new Error('Invalid data'));
        }
      }, 1000);
    });
  },

  loginWithGoogle: async () => {
    // Mock implementation - replace with actual Google OAuth
    return new Promise<{
      id: string;
      email: string;
      name: string;
      provider: 'google';
      token: string;
    }>((resolve) => {
      setTimeout(() => {
        resolve({
          id: `google_${Date.now()}`,
          email: 'user@gmail.com',
          name: 'Google User',
          provider: 'google',
          token: `google_token_${Date.now()}`
        });
      }, 1000);
    });
  },

  loginWithApple: async () => {
    // Mock implementation - replace with actual Apple Sign In
    return new Promise<{
      id: string;
      email: string;
      name: string;
      provider: 'apple';
      token: string;
    }>((resolve) => {
      setTimeout(() => {
        resolve({
          id: `apple_${Date.now()}`,
          email: 'user@icloud.com',
          name: 'Apple User',
          provider: 'apple',
          token: `apple_token_${Date.now()}`
        });
      }, 1000);
    });
  },

  verifyToken: async (token: string) => {
    // Mock token verification - replace with actual API call
    return new Promise<{ valid: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ valid: true });
      }, 500);
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
