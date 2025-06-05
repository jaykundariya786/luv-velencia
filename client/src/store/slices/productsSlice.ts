
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI } from '../../services/api';
import { type Product } from '@shared/schema';

interface UseProductsFilters {
  category?: string;
  line?: string;
  sort?: string;
  search?: string;
  colors?: string[];
  materials?: string[];
}

interface ProductsState {
  products: Product[];
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

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters?: UseProductsFilters) => {
    const response = await productsAPI.getProducts(filters);
    return response;
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id: number) => {
    const response = await productsAPI.getProduct(id);
    return response;
  }
);

export const fetchSavedItems = createAsyncThunk(
  'products/fetchSavedItems',
  async () => {
    const response = await productsAPI.getSavedItems();
    return response;
  }
);

export const fetchRecentlyViewed = createAsyncThunk(
  'products/fetchRecentlyViewed',
  async () => {
    const response = await productsAPI.getRecentlyViewed();
    return response;
  }
);

const productsSlice = createSlice({
  name: 'products',
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
        state.error = action.error.message || 'Failed to fetch products';
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
        state.error = action.error.message || 'Failed to fetch product';
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
