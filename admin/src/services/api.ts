// API Service for LV Backend Integration
const API_BASE_URL = "http://0.0.0.0:5001/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem("adminToken");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("adminToken", token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem("adminToken");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Don't set Content-Type for FormData
    if (options.body instanceof FormData) {
      delete (config.headers as any)["Content-Type"];
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      // Handle LV Backend response format
      if (data.success !== undefined) {
        return data;
      }

      // Wrap plain data in success format
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials: { username: string; password: string }) {
    return this.request<{ token: string; user: any }>("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async verifyToken() {
    return this.request<{ user: any }>("/auth/me");
  }

  async logout() {
    const result = await this.request("/auth/logout", { method: "POST" });
    this.removeToken();
    return result;
  }

  // Dashboard methods
  async getDashboardData() {
    return this.request<{
      overview: {
        totalUsers: number;
        activeUsers: number;
        totalOrders: number;
        totalRevenue: number;
        averageOrderValue: number;
        totalProducts: number;
        totalCategories: number;
      };
      orderStatus: {
        pending: number;
        confirmed: number;
        shipped: number;
        delivered: number;
        cancelled: number;
      };
      recentOrders: any[];
      lowStockProducts: any[];
      topProducts: any[];
    }>("/admin/dashboard");
  }

  // Analytics methods
  async getAnalyticsOverview(period: string = "30d") {
    return this.request<{
      revenue: any;
      period: { start: Date; end: Date };
      salesData: any[];
      topProducts: any[];
      categoryData: any[];
    }>(`/admin/analytics?period=${period}`);
  }

  async getSalesAnalytics(period: string = "30d") {
    return this.request<{
      dailySales: any[];
      categorySales: any[];
      productSales: any[];
      regionSales: any[];
    }>(`/admin/analytics/sales?period=${period}`);
  }

  // Orders methods
  async getOrders(
    params: {
      page?: number;
      limit?: number;
      status?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<{
      orders: any[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalOrders: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
        limit: number;
      };
    }>(`/admin/orders?${queryParams.toString()}`);
  }

  async getOrder(id: string) {
    return this.request<any>(`/admin/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request<any>(`/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // Users methods
  async getUsers(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
      status?: string;
    } = {}
  ) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<{
      users: any[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalUsers: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
        limit: number;
      };
    }>(`/admin/users?${queryParams.toString()}`);
  }

  async getFirebaseUsers(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    } = {}
  ) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<{
      users: any[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/admin/users/firebase?${queryParams.toString()}`);
  }

  async getUser(id: string) {
    return this.request<any>(`/admin/users/${id}`);
  }

  async updateUser(id: string, userData: any) {
    return this.request<any>(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async toggleUserStatus(id: string) {
    return this.request<any>(`/admin/users/${id}/toggle-status`, {
      method: "PATCH",
    });
  }

  async deleteUser(id: string) {
    return this.request<any>(`/admin/users/${id}`, {
      method: "DELETE",
    });
  }

  // Products methods
  async getProducts(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      status?: string;
    } = {}
  ) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<{
      products: any[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalProducts: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
        limit: number;
      };
    }>(`/admin/products?${queryParams.toString()}`);
  }

  async getProduct(id: string) {
    return this.request<any>(`/admin/products/${id}`);
  }

  async createProduct(productData: any) {
    return this.request<any>("/admin/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any) {
    return this.request<any>(`/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request<any>(`/admin/products/${id}`, {
      method: "DELETE",
    });
  }

  async updateProductStock(
    id: string,
    stockData: { stock: number; lowStockThreshold?: number }
  ) {
    return this.request<any>(`/admin/products/${id}/stock`, {
      method: "PATCH",
      body: JSON.stringify(stockData),
    });
  }

  async getLowStockAlerts() {
    return this.request<{ alerts: any[] }>("/admin/products/low-stock");
  }

  // Categories methods
  async getCategories() {
    return this.request<{ categories: any[] }>("/admin/categories");
  }

  async createCategory(categoryData: any) {
    return this.request<any>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: any) {
    return this.request<any>(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string) {
    return this.request<any>(`/admin/categories/${id}`, {
      method: "DELETE",
    });
  }

  // Product variants
  async createProductVariant(productId: string, variantData: any) {
    return this.request<any>(`/admin/products/${productId}/variants`, {
      method: "POST",
      body: JSON.stringify(variantData),
    });
  }

  async updateProductVariant(
    productId: string,
    variantId: string,
    variantData: any
  ) {
    return this.request<any>(
      `/admin/products/${productId}/variants/${variantId}`,
      {
        method: "PUT",
        body: JSON.stringify(variantData),
      }
    );
  }

  async deleteProductVariant(productId: string, variantId: string) {
    return this.request<any>(
      `/admin/products/${productId}/variants/${variantId}`,
      {
        method: "DELETE",
      }
    );
  }

  // Image management
  async uploadImages(productId: string | undefined, files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const endpoint = productId
      ? `/admin/products/${productId}/images`
      : "/admin/upload/images";

    return this.request<{ images: string[] }>(endpoint, {
      method: "POST",
      body: formData,
    });
  }

  async reorderImages(productId: string, imageOrder: string[]) {
    return this.request<any>(`/admin/products/${productId}/images/reorder`, {
      method: "PATCH",
      body: JSON.stringify({ imageOrder }),
    });
  }

  async setCoverImage(productId: string, imageIndex: number) {
    return this.request<any>(`/admin/products/${productId}/images/cover`, {
      method: "PATCH",
      body: JSON.stringify({ coverImageIndex: imageIndex }),
    });
  }
}

// Create and export API service instance
export const apiService = new ApiService(API_BASE_URL);

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    apiService.login(credentials),
  verifyToken: () => apiService.verifyToken(),
  logout: () => apiService.logout(),
};

// Dashboard API
export const dashboardAPI = {
  getDashboardData: () => apiService.getDashboardData(),
};

// Analytics API
export const analyticsAPI = {
  getOverview: (period?: string) => apiService.getAnalyticsOverview(period),
  getSales: (period?: string) => apiService.getSalesAnalytics(period),
};

// Orders API
export const ordersAPI = {
  getOrders: (params?: any) => apiService.getOrders(params),
  getOrder: (id: string) => apiService.getOrder(id),
  updateOrderStatus: (id: string, status: string) =>
    apiService.updateOrderStatus(id, status),
  generateBill: (id: string) => {
    return Promise.resolve({ success: true, billUrl: `/bills/${id}.pdf` });
  },
};

// Users API
export const usersAPI = {
  getUsers: (params?: any) => apiService.getUsers(params),
  getFirebaseUsers: (params?: any) => apiService.getFirebaseUsers(params),
  getUser: (id: string) => apiService.getUser(id),
  updateUser: (id: string, data: any) => apiService.updateUser(id, data),
  deleteUser: (id: string) => apiService.deleteUser(id),
  toggleUserStatus: (id: string) => apiService.toggleUserStatus(id),
};

// Products API
export const productsAPI = {
  getProducts: (params?: any) => apiService.getProducts(params),
  getProduct: (id: string) => apiService.getProduct(id),
  createProduct: (data: any) => apiService.createProduct(data),
  updateProduct: (id: string, data: any) => apiService.updateProduct(id, data),
  deleteProduct: (id: string) => apiService.deleteProduct(id),
  updateProductStock: (id: string, stockData: any) =>
    apiService.updateProductStock(id, stockData),
  getLowStockAlerts: () => apiService.getLowStockAlerts(),
  getCategories: () => apiService.getCategories(),
  createCategory: (data: any) => apiService.createCategory(data),
  updateCategory: (id: string, data: any) =>
    apiService.updateCategory(id, data),
  deleteCategory: (id: string) => apiService.deleteCategory(id),
  createProductVariant: (productId: string, data: any) =>
    apiService.createProductVariant(productId, data),
  updateProductVariant: (productId: string, variantId: string, data: any) =>
    apiService.updateProductVariant(productId, variantId, data),
  deleteProductVariant: (productId: string, variantId: string) =>
    apiService.deleteProductVariant(productId, variantId),
  uploadImages: (productId: string | undefined, files: File[]) =>
    apiService.uploadImages(productId, files),
  reorderImages: (productId: string, imageOrder: string[]) =>
    apiService.reorderImages(productId, imageOrder),
  setCoverImage: (productId: string, imageIndex: number) =>
    apiService.setCoverImage(productId, imageIndex),
};

export default apiService;
