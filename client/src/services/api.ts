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

// Materials and Care API
export const materialsCareAPI = {
  getMaterialsCare: async (): Promise<Array<{
    id: string;
    title: string;
    content: string;
  }>> => {
    return api.get('/materials-care');
  },

  getMaterialsCareById: async (id: string): Promise<{
    id: string;
    title: string;
    content: string;
  }> => {
    return api.get(`/materials-care/${id}`);
  },
};

export const getSizeGuide = async (category: 'mens' | 'womens') => {
  const response = await fetch(`/api/size-guide/${category}`);
  if (!response.ok) {
    throw new Error('Failed to fetch size guide data');
  }
  return response.json();
};

export const getSearchSuggestions = async () => {
  const response = await fetch('/api/search-suggestions');
  if (!response.ok) {
    throw new Error('Failed to fetch search suggestions');
  }
  return response.json();
};

// Get saved items
export const getSavedItems = async () => {
  const response = await fetch("/api/saved-items");
  if (!response.ok) {
    throw new Error("Failed to fetch saved items");
  }
  return response.json();
};

// Remove saved item
export const removeSavedItem = async (id: number) => {
  const response = await fetch(`/api/saved-items/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to remove saved item");
  }
  return response.json();
};

// Get user profile
export const getUserProfile = async () => {
  const response = await fetch("/api/user/profile");
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return response.json();
};

// Update user profile
export const updateUserProfile = async (profileData: any) => {
  const response = await fetch("/api/user/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) {
    throw new Error("Failed to update user profile");
  }
  return response.json();
};

// Get user orders
export const getUserOrders = async () => {
  const response = await fetch("/api/user/orders");
  if (!response.ok) {
    throw new Error("Failed to fetch user orders");
  }
  return response.json();
};

// Get user addresses
export const getUserAddresses = async () => {
  const response = await fetch("/api/user/addresses");
  if (!response.ok) {
    throw new Error("Failed to fetch user addresses");
  }
  return response.json();
};

// Add user address
export const addUserAddress = async (addressData: any) => {
  const response = await fetch("/api/user/addresses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addressData),
  });
  if (!response.ok) {
    throw new Error("Failed to add user address");
  }
  return response.json();
};

// Update user address
export const updateUserAddress = async (id: number, addressData: any) => {
  const response = await fetch(`/api/user/addresses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addressData),
  });
  if (!response.ok) {
    throw new Error("Failed to update user address");
  }
  return response.json();
};

// Delete user address
export const deleteUserAddress = async (id: number) => {
  const response = await fetch(`/api/user/addresses/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete user address");
  }
  return response.json();
};

// Get account menu data
export const getAccountMenu = async () => {
  const response = await fetch("/api/account-menu");
  if (!response.ok) {
    throw new Error("Failed to fetch account menu");
  }
  return response.json();
};

export default api;