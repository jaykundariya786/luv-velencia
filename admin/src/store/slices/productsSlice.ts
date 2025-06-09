
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI } from '../../services/api';

interface ProductVariant {
  id: string;
  sku: string;
  size?: string;
  color?: string;
  material?: string;
  price?: number;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock';
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  category: string;
  images: string[];
  coverImageIndex: number;
  sizes?: string[];
  colors?: string[];
  materials?: string[];
  hasVariants: boolean;
  variants?: ProductVariant[];
  isActive: boolean;
  isOutOfStock?: boolean;
  isLowStock?: boolean;
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock';
  createdAt: string;
  updatedAt: string;
}

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  categories: string[];
  loading: boolean;
  error: string | null;
  totalProducts: number;
  currentPage: number;
  pageSize: number;
  stockSummary: {
    total: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
  } | null;
  lowStockAlerts: Product[];
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  categories: [],
  loading: false,
  error: null,
  totalProducts: 0,
  currentPage: 1,
  pageSize: 12,
  stockSummary: null,
  lowStockAlerts: [],
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params?: any, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getProducts(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getProduct(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (data: Partial<Product>, { rejectWithValue }) => {
    try {
      const response = await productsAPI.createProduct(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: string; data: Partial<Product> }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.updateProduct(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      await productsAPI.deleteProduct(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getCategories();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const updateProductStock = createAsyncThunk(
  'products/updateProductStock',
  async ({ id, stock, lowStockThreshold }: { id: string; stock: number; lowStockThreshold?: number }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.updateProductStock(id, { stock, lowStockThreshold });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update stock');
    }
  }
);

export const fetchLowStockAlerts = createAsyncThunk(
  'products/fetchLowStockAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getLowStockAlerts();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch low stock alerts');
    }
  }
);

export const createProductVariant = createAsyncThunk(
  'products/createProductVariant',
  async ({ productId, variantData }: { productId: string; variantData: Partial<ProductVariant> }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.createProductVariant(productId, variantData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create variant');
    }
  }
);

export const updateProductVariant = createAsyncThunk(
  'products/updateProductVariant',
  async ({ productId, variantId, variantData }: { productId: string; variantId: string; variantData: Partial<ProductVariant> }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.updateProductVariant(productId, variantId, variantData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update variant');
    }
  }
);

export const deleteProductVariant = createAsyncThunk(
  'products/deleteProductVariant',
  async ({ productId, variantId }: { productId: string; variantId: string }, { rejectWithValue }) => {
    try {
      await productsAPI.deleteProductVariant(productId, variantId);
      return { productId, variantId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete variant');
    }
  }
);

export const uploadProductImages = createAsyncThunk(
  'products/uploadProductImages',
  async ({ productId, files }: { productId?: string; files: File[] }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.uploadImages(productId, files);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload images');
    }
  }
);

export const reorderProductImages = createAsyncThunk(
  'products/reorderProductImages',
  async ({ productId, imageOrder }: { productId: string; imageOrder: string[] }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.reorderImages(productId, imageOrder);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reorder images');
    }
  }
);

export const setCoverImage = createAsyncThunk(
  'products/setCoverImage',
  async ({ productId, imageIndex }: { productId: string; imageIndex: number }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.setCoverImage(productId, imageIndex);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to set cover image');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || action.payload;
        state.totalProducts = action.payload.total || action.payload.length;
        state.currentPage = action.payload.page || 1;
        state.stockSummary = action.payload.stockSummary || null;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Product
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
        state.totalProducts += 1;
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        // Update product in the list
        const index = state.products.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(product => product.id !== action.payload);
        state.totalProducts -= 1;
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Update Product Stock
      .addCase(updateProductStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        state.loading = false;
        // Update product in the list
        const index = state.products.findIndex(product => product.id === action.payload.id.toString());
        if (index !== -1) {
          state.products[index] = {
            ...state.products[index],
            stock: action.payload.stock,
            lowStockThreshold: action.payload.lowStockThreshold,
            inStock: action.payload.inStock,
            stockStatus: action.payload.stockStatus,
            isOutOfStock: action.payload.stockStatus === 'out-of-stock',
            isLowStock: action.payload.stockStatus === 'low-stock',
          };
        }
        state.error = null;
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Low Stock Alerts
      .addCase(fetchLowStockAlerts.fulfilled, (state, action) => {
        state.lowStockAlerts = action.payload.alerts || [];
      });
  },
});

export const { clearError, setCurrentPage, clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;
