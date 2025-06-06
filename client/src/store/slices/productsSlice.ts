import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Local Product interface to avoid circular imports
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  line?: string;
  colors?: string[];
  materials?: string[];
  description?: string;
}

interface UseProductsFilters {
  category?: string;
  line?: string;
  sort?: string;
  search?: string;
  colors?: string[];
  materials?: string[];
}

interface ProductsState {
  products: any;
  currentProduct: Product | null;
  savedItems: Product[];
  recentlyViewed: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  savedItems: [],
  recentlyViewed: [],
  isLoading: false,
  error: null,
};

// Simple API functions to avoid circular imports
const productsAPI = {
  getProducts: async (filters?: UseProductsFilters) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.line) params.append("line", filters.line);
    if (filters?.sort) params.append("sort", filters.sort);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.colors?.length)
      params.append("colors", filters.colors.join(","));
    if (filters?.materials?.length)
      params.append("materials", filters.materials.join(","));

    const response = await fetch(`/api/products?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  getProduct: async (id: number) => {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  },

  getSavedItems: async () => {
    const response = await fetch("/api/saved-items");
    if (!response.ok) throw new Error("Failed to fetch saved items");
    return response.json();
  },

  getRecentlyViewed: async () => {
    const response = await fetch("/api/recently-viewed");
    if (!response.ok) throw new Error("Failed to fetch recently viewed");
    return response.json();
  },
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters?: UseProductsFilters) => {
    const response = await productsAPI.getProducts(filters);
    return response;
  }
);

export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (id: number) => {
    const response = await productsAPI.getProduct(id);
    return response;
  }
);

export const fetchSavedItems = createAsyncThunk(
  "products/fetchSavedItems",
  async () => {
    const response = await productsAPI.getSavedItems();
    return response;
  }
);

export const fetchRecentlyViewed = createAsyncThunk(
  "products/fetchRecentlyViewed",
  async () => {
    const response = await productsAPI.getRecentlyViewed();
    return response;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      // Fetch single product
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch product";
      })
      // Fetch saved items
      .addCase(fetchSavedItems.fulfilled, (state, action) => {
        state.savedItems = action.payload;
      })
      // Fetch recently viewed
      .addCase(fetchRecentlyViewed.fulfilled, (state, action) => {
        state.recentlyViewed = action.payload;
      });
  },
});

export const { clearCurrentProduct, clearError } = productsSlice.actions;

export default productsSlice.reducer;
