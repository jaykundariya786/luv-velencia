import axios from 'axios';
import { logout } from '../store/slices/authSlice';
import { store } from '../store';

// Product interface based on LV Backend schema
interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  subcategory?: string;
  brand: string;
  tags: string[];
  line: string;
  variants: Array<{
    size: string;
    color: string;
    colorCode?: string;
    sku: string;
    price: number;
    salePrice?: number;
    stock: number;
    images: Array<{
      url: string;
      publicId?: string;
      alt?: string;
      isPrimary?: boolean;
    }>;
  }>;
  basePrice: number;
  salePrice?: number;
  isOnSale: boolean;
  totalStock: number;
  status: string;
  isFeature: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  averageRating: number;
  totalReviews: number;
  materials?: Array<{ name: string; percentage: number }>;
  care?: string[];
  features?: string[];
}

// Create axios instance pointing to LV Backend through proxy
const api = axios.create({
  baseURL: '/lv-api',
  timeout: 10000,
  withCredentials: true,
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
      store.dispatch(logout());
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { 
        email, 
        password 
      });

      return {
        id: response.user._id,
        email: response.user.email,
        name: `${response.user.firstName} ${response.user.lastName}`,
        provider: 'email' as const,
        token: response.token,
        user: response.user
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  signup: async (email: string, password: string, name: string) => {
    try {
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      const response = await api.post('/auth/register', {
        firstName,
        lastName,
        email,
        password
      });

      return {
        id: response.user._id,
        email: response.user.email,
        name: `${response.user.firstName} ${response.user.lastName}`,
        provider: 'email' as const,
        token: response.token,
        user: response.user
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  loginWithGoogle: async () => {
    window.location.href = '/lv-api/auth/google';
    return new Promise((resolve, reject) => {
      reject(new Error('OAuth redirect in progress'));
    });
  },

  loginWithApple: async () => {
    window.location.href = '/lv-api/auth/apple';
    return new Promise((resolve, reject) => {
      reject(new Error('OAuth redirect in progress'));
    });
  },

  verifyToken: async (token: string) => {
    try {
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { valid: true, user: response.user };
    } catch (error) {
      return { valid: false };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send reset email');
    }
  },

  resetPassword: async (token: string, password: string) => {
    try {
      const response = await api.post('/auth/reset-password', { 
        token, 
        password 
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
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
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; pagination?: any }> => {
    try {
      const params = new URLSearchParams();

      if (filters?.category) params.append("category", filters.category);
      if (filters?.line) params.append("line", filters.line);
      if (filters?.sort) params.append("sort", filters.sort);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.colors && filters.colors.length > 0) {
        params.append("colors", filters.colors.join(","));
      }
      if (filters?.materials && filters.materials.length > 0) {
        params.append("materials", filters.materials.join(","));
      }

      const queryString = params.toString();
      const url = `/products${queryString ? `?${queryString}` : ""}`;

      const response = await api.get(url);
      return response.data || response;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },

  getProduct: async (id: string): Promise<Product> => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data || response;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw error;
    }
  },

  getCategories: async (): Promise<string[]> => {
    try {
      const response = await api.get('/categories');
      return response.data || response.map((cat: any) => cat.name);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get('/products?featured=true&limit=8');
      return response.data || response.products;
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      throw error;
    }
  },

  getBestsellerProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get('/products?bestseller=true&limit=8');
      return response.data || response.products;
    } catch (error) {
      console.error('Failed to fetch bestseller products:', error);
      throw error;
    }
  },

  getNewArrivalProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get('/products?newArrival=true&limit=8');
      return response.data || response.products;
    } catch (error) {
      console.error('Failed to fetch new arrival products:', error);
      throw error;
    }
  },

  searchProducts: async (query: string, options?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    line?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; pagination?: any }> => {
    try {
      const params = new URLSearchParams();
      params.append('search', query);

      if (options?.category) params.append('category', options.category);
      if (options?.minPrice) params.append('minPrice', options.minPrice.toString());
      if (options?.maxPrice) params.append('maxPrice', options.maxPrice.toString());
      if (options?.line) params.append('line', options.line);
      if (options?.page) params.append('page', options.page.toString());
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.tags && options.tags.length > 0) {
        params.append('tags', options.tags.join(','));
      }

      const response = await api.get(`/products/search?${params.toString()}`);
      return response.data || response;
    } catch (error) {
      console.error('Failed to search products:', error);
      throw error;
    }
  },
};

// Utility APIs
export const utilityAPI = {
  getSizeGuide: async (category: 'mens' | 'womens') => {
    try {
      const response = await api.get('/utility/size-guide');
      return response;
    } catch (error) {
      console.error('Failed to fetch size guide:', error);
      throw error;
    }
  },

  getSearchSuggestions: async (query?: string) => {
    try {
      const params = query ? `?q=${encodeURIComponent(query)}` : '';
      const response = await api.get(`/utility/search-suggestions${params}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch search suggestions:', error);
      return {
        trending: [
          { query: "Shirt", icon: "search" },
          { query: "Pant", icon: "search" },
          { query: "T-shirt", icon: "search" },
        ],
        newIn: [
          { query: "Giallo", category: "new" },
          { query: "Women", category: "new" },
        ],
        featured: [
          { query: "Lido Collection", category: "collection" }
        ],
      };
    }
  },

  getAccountMenu: async () => {
    try {
      const response = await api.get('/utility/account-menu');
      return response;
    } catch (error) {
      console.error('Failed to fetch account menu:', error);
      throw error;
    }
  },
};

// User Management API
export const userAPI = {
  getProfile: async (userId?: string) => {
    try {
      const url = userId ? `/users/${userId}` : "/users/profile";
      const response = await api.get(url);
      return response;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error;
    }
  },

  updateProfile: async (userId: string, profileData: any) => {
    try {
      const response = await api.put(`/users/${userId}`, profileData);
      return response;
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw error;
    }
  },

  updatePreferences: async (userId: string, preferences: any) => {
    try {
      const response = await api.patch(`/users/${userId}/preferences`, preferences);
      return response;
    } catch (error) {
      console.error("Failed to update user preferences:", error);
      throw error;
    }
  },

  updatePassword: async (userId: string, oldPassword: string, newPassword: string) => {
    try {
      const response = await api.patch(`/users/${userId}/password`, {
        oldPassword,
        newPassword
      });
      return response;
    } catch (error) {
      console.error("Failed to update password:", error);
      throw error;
    }
  },
};

// Wishlist/Saved Items API
export const wishlistAPI = {
  getWishlist: async (userId: string) => {
    try {
      const response = await api.get(`/wishlist/${userId}`);
      return response;
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      throw error;
    }
  },

  addToWishlist: async (userId: string, productId: string) => {
    try {
      const response = await api.post(`/wishlist/${userId}`, { productId });
      return response;
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      throw error;
    }
  },

  removeFromWishlist: async (userId: string, productId: string) => {
    try {
      const response = await api.delete(`/wishlist/${userId}/${productId}`);
      return response;
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      throw error;
    }
  },

  isInWishlist: async (userId: string, productId: string) => {
    try {
      const response = await api.get(`/wishlist/${userId}/check/${productId}`);
      return response.isInWishlist;
    } catch (error) {
      console.error("Failed to check wishlist status:", error);
      return false;
    }
  },
};

// Cart API
export const cartAPI = {
  getCart: async (userId: string) => {
    try {
      const response = await api.get(`/cart/${userId}`);
      return response;
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      throw error;
    }
  },

  addToCart: async (userId: string, productId: string, variantId: string, quantity: number = 1) => {
    try {
      const response = await api.post(`/cart/${userId}`, {
        productId,
        variantId,
        quantity
      });
      return response;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  },

  updateCartItem: async (userId: string, itemId: string, quantity: number) => {
    try {
      const response = await api.patch(`/cart/${userId}/${itemId}`, { quantity });
      return response;
    } catch (error) {
      console.error("Failed to update cart item:", error);
      throw error;
    }
  },

  removeFromCart: async (userId: string, itemId: string) => {
    try {
      const response = await api.delete(`/cart/${userId}/${itemId}`);
      return response;
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    }
  },

  clearCart: async (userId: string) => {
    try {
      const response = await api.delete(`/cart/${userId}`);
      return response;
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  },
};

// Orders API  
export const ordersAPI = {
  getUserOrders: async (userId: string, options?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    try {
      const params = new URLSearchParams();
      if (options?.page) params.append('page', options.page.toString());
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.status) params.append('status', options.status);

      const queryString = params.toString();
      const url = `/orders/user/${userId}${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url);
      return response;
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
      throw error;
    }
  },

  getOrder: async (orderId: string) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response;
    } catch (error) {
      console.error("Failed to fetch order:", error);
      throw error;
    }
  },

  createOrder: async (orderData: {
    userId: string;
    items: Array<{
      productId: string;
      variantId: string;
      quantity: number;
      price: number;
    }>;
    shippingAddress: any;
    billingAddress?: any;
    paymentMethod: string;
    notes?: string;
  }) => {
    try {
      const response = await api.post('/orders', orderData);
      return response;
    } catch (error) {
      console.error("Failed to create order:", error);
      throw error;
    }
  },

  cancelOrder: async (orderId: string, reason?: string) => {
    try {
      const response = await api.patch(`/orders/${orderId}/cancel`, { reason });
      return response;
    } catch (error) {
      console.error("Failed to cancel order:", error);
      throw error;
    }
  },
};

// Address Management API
export const addressAPI = {
  getUserAddresses: async (userId: string) => {
    try {
      const response = await api.get(`/users/${userId}/addresses`);
      return response;
    } catch (error) {
      console.error("Failed to fetch user addresses:", error);
      throw error;
    }
  },

  addUserAddress: async (userId: string, addressData: any) => {
    try {
      const response = await api.post(`/users/${userId}/addresses`, addressData);
      return response;
    } catch (error) {
      console.error("Failed to add user address:", error);
      throw error;
    }
  },

  updateUserAddress: async (userId: string, addressId: string, addressData: any) => {
    try {
      const response = await api.put(`/users/${userId}/addresses/${addressId}`, addressData);
      return response;
    } catch (error) {
      console.error("Failed to update user address:", error);
      throw error;
    }
  },

  deleteUserAddress: async (userId: string, addressId: string) => {
    try {
      const response = await api.delete(`/users/${userId}/addresses/${addressId}`);
      return response;
    } catch (error) {
      console.error("Failed to delete user address:", error);
      throw error;
    }
  },
};

// Payment Methods API
export const paymentAPI = {
  getUserPaymentMethods: async (userId: string) => {
    try {
      const response = await api.get(`/users/${userId}/payment-methods`);
      return response;
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
      throw error;
    }
  },

  addUserPaymentMethod: async (userId: string, paymentData: any) => {
    try {
      const response = await api.post(`/users/${userId}/payment-methods`, paymentData);
      return response;
    } catch (error) {
      console.error("Failed to add payment method:", error);
      throw error;
    }
  },

  updateUserPaymentMethod: async (userId: string, paymentId: string, paymentData: any) => {
    try {
      const response = await api.put(`/users/${userId}/payment-methods/${paymentId}`, paymentData);
      return response;
    } catch (error) {
      console.error("Failed to update payment method:", error);
      throw error;
    }
  },

  deleteUserPaymentMethod: async (userId: string, paymentId: string) => {
    try {
      const response = await api.delete(`/users/${userId}/payment-methods/${paymentId}`);
      return response;
    } catch (error) {
      console.error("Failed to delete payment method:", error);
      throw error;
    }
  },
};

// Materials Care API
export const materialsCareAPI = {
  getMaterialsCare: async () => {
    try {
      const response = await api.get('/utility/materials-care');
      return response;
    } catch (error) {
      console.error('Failed to fetch materials care:', error);
      // Return fallback data
      return [
        { fabric: "Cotton", care: "Machine wash cold, tumble dry low" },
        { fabric: "Silk", care: "Dry clean only or hand wash with silk detergent" },
        { fabric: "Wool", care: "Dry clean recommended, or hand wash cold" },
        { fabric: "Denim", care: "Wash inside out in cold water, air dry" },
        { fabric: "Linen", care: "Machine wash cold, iron while damp" },
        { fabric: "Cashmere", care: "Hand wash cold, lay flat to dry" }
      ];
    }
  },

  getMaterialsCareById: async (id: string) => {
    try {
      const response = await api.get(`/utility/materials-care/${id}`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch materials care for ${id}:`, error);
      throw error;
    }
  },
};

// Legacy exports for backward compatibility
export const getUserOrders = ordersAPI.getUserOrders;
export const getUserProfile = userAPI.getProfile;
export const getSavedItems = wishlistAPI.getWishlist;
export const removeSavedItem = wishlistAPI.removeFromWishlist;
export const addSavedItem = wishlistAPI.addToWishlist;
export const getUserAddresses = addressAPI.getUserAddresses;
export const addUserAddress = addressAPI.addUserAddress;
export const updateUserAddress = addressAPI.updateUserAddress;
export const deleteUserAddress = addressAPI.deleteUserAddress;
export const updateUserProfile = userAPI.updateProfile;
export const getUserPaymentMethods = paymentAPI.getUserPaymentMethods;
export const addUserPaymentMethod = paymentAPI.addUserPaymentMethod;
export const updateUserPaymentMethod = paymentAPI.updateUserPaymentMethod;
export const deleteUserPaymentMethod = paymentAPI.deleteUserPaymentMethod;
export const getSearchSuggestions = utilityAPI.getSearchSuggestions;
export const getSizeGuide = utilityAPI.getSizeGuide;
export const getAccountMenu = utilityAPI.getAccountMenu;

export default api;