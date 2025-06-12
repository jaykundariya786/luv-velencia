import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import discountsAPI from "../../services/api";
import couponsAPI from "../../services/api";

interface Discount {
  id: string;
  name: string;
  description: string;
  type: "percentage" | "fixed_amount";
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicationType: "product" | "category" | "global";
  targetProductIds?: string[];
  targetCategories?: string[];
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Coupon {
  id: string;
  code: string;
  discountId: string;
  discountName: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DiscountsState {
  discounts: Discount[];
  coupons: Coupon[];
  currentDiscount: Discount | null;
  currentCoupon: Coupon | null;
  loading: boolean;
  error: string | null;
  totalDiscounts: number;
  totalCoupons: number;
  currentPage: number;
  pageSize: number;
}

const initialState: DiscountsState = {
  discounts: [],
  coupons: [],
  currentDiscount: null,
  currentCoupon: null,
  loading: false,
  error: null,
  totalDiscounts: 0,
  totalCoupons: 0,
  currentPage: 1,
  pageSize: 10,
};

// Async thunks for discounts
export const fetchDiscounts = createAsyncThunk(
  "discounts/fetchDiscounts",
  async (params?: any, { rejectWithValue }) => {
    try {
      const response = await discountsAPI.getDiscounts(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch discounts"
      );
    }
  }
);

export const fetchDiscount = createAsyncThunk(
  "discounts/fetchDiscount",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await discountsAPI.getDiscount(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch discount"
      );
    }
  }
);

export const createDiscount = createAsyncThunk(
  "discounts/createDiscount",
  async (data: Partial<Discount>, { rejectWithValue }) => {
    try {
      const response = await discountsAPI.createDiscount(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create discount"
      );
    }
  }
);

export const updateDiscount = createAsyncThunk(
  "discounts/updateDiscount",
  async (
    { id, data }: { id: string; data: Partial<Discount> },
    { rejectWithValue }
  ) => {
    try {
      const response = await discountsAPI.updateDiscount(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update discount"
      );
    }
  }
);

export const deleteDiscount = createAsyncThunk(
  "discounts/deleteDiscount",
  async (id: string, { rejectWithValue }) => {
    try {
      await discountsAPI.deleteDiscount(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete discount"
      );
    }
  }
);

// Async thunks for coupons
export const fetchCoupons = createAsyncThunk(
  "discounts/fetchCoupons",
  async (params?: any, { rejectWithValue }) => {
    try {
      const response = await couponsAPI.getCoupons(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch coupons"
      );
    }
  }
);

export const createCoupon = createAsyncThunk(
  "discounts/createCoupon",
  async (data: Partial<Coupon>, { rejectWithValue }) => {
    try {
      const response = await couponsAPI.createCoupon(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create coupon"
      );
    }
  }
);

export const updateCoupon = createAsyncThunk(
  "discounts/updateCoupon",
  async (
    { id, data }: { id: string; data: Partial<Coupon> },
    { rejectWithValue }
  ) => {
    try {
      const response = await couponsAPI.updateCoupon(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update coupon"
      );
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "discounts/deleteCoupon",
  async (id: string, { rejectWithValue }) => {
    try {
      await couponsAPI.deleteCoupon(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete coupon"
      );
    }
  }
);

const discountsSlice = createSlice({
  name: "discounts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearCurrentDiscount: (state) => {
      state.currentDiscount = null;
    },
    clearCurrentCoupon: (state) => {
      state.currentCoupon = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Discounts
      .addCase(fetchDiscounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscounts.fulfilled, (state, action) => {
        state.loading = false;
        state.discounts = action.payload.discounts || action.payload;
        state.totalDiscounts = action.payload.total || action.payload.length;
        state.error = null;
      })
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Discount
      .addCase(fetchDiscount.fulfilled, (state, action) => {
        state.currentDiscount = action.payload;
      })
      // Create Discount
      .addCase(createDiscount.fulfilled, (state, action) => {
        state.discounts.unshift(action.payload);
        state.totalDiscounts += 1;
      })
      // Update Discount
      .addCase(updateDiscount.fulfilled, (state, action) => {
        state.currentDiscount = action.payload;
        const index = state.discounts.findIndex(
          (discount) => discount.id === action.payload.id
        );
        if (index !== -1) {
          state.discounts[index] = action.payload;
        }
      })
      // Delete Discount
      .addCase(deleteDiscount.fulfilled, (state, action) => {
        state.discounts = state.discounts.filter(
          (discount) => discount.id !== action.payload
        );
        state.totalDiscounts -= 1;
      })
      // Fetch Coupons
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.coupons = action.payload.coupons || action.payload;
        state.totalCoupons = action.payload.total || action.payload.length;
      })
      // Create Coupon
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.coupons.unshift(action.payload);
        state.totalCoupons += 1;
      })
      // Update Coupon
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const index = state.coupons.findIndex(
          (coupon) => coupon.id === action.payload.id
        );
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      })
      // Delete Coupon
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(
          (coupon) => coupon.id !== action.payload
        );
        state.totalCoupons -= 1;
      });
  },
});

export const {
  clearError,
  setCurrentPage,
  clearCurrentDiscount,
  clearCurrentCoupon,
} = discountsSlice.actions;
export default discountsSlice.reducer;
