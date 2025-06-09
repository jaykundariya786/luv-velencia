
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsAPI } from '../../services/api';

interface SalesAnalytics {
  summary: {
    totalSales: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  salesByPeriod: Array<{
    date: string;
    sales: number;
    orders: number;
    customers: number;
  }>;
  topSellingProducts: Array<{
    productId: number;
    productName: string;
    category: string;
    totalSales: number;
    unitsSold: number;
    revenue: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    sales: number;
    percentage: number;
  }>;
  userOrderHistory: Array<{
    userId: number;
    userName: string;
    email: string;
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate: string;
  }>;
}

interface Report {
  id: number;
  name: string;
  type: string;
  period: string;
  generatedAt: string;
  fileUrl?: string;
  status: 'generating' | 'completed' | 'failed';
  estimatedCompletion?: string;
}

interface AnalyticsState {
  salesAnalytics: SalesAnalytics | null;
  reports: Report[];
  loading: boolean;
  error: string | null;
  reportGenerating: boolean;
}

const initialState: AnalyticsState = {
  salesAnalytics: null,
  reports: [],
  loading: false,
  error: null,
  reportGenerating: false,
};

// Async thunks
export const fetchSalesAnalytics = createAsyncThunk(
  'analytics/fetchSalesAnalytics',
  async (params?: any, { rejectWithValue }) => {
    try {
      const response = await analyticsAPI.getSalesAnalytics(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sales analytics');
    }
  }
);

export const fetchReports = createAsyncThunk(
  'analytics/fetchReports',
  async (params?: any, { rejectWithValue }) => {
    try {
      const response = await analyticsAPI.getReports(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports');
    }
  }
);

export const generateReport = createAsyncThunk(
  'analytics/generateReport',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await analyticsAPI.generateReport(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate report');
    }
  }
);

export const downloadReport = createAsyncThunk(
  'analytics/downloadReport',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await analyticsAPI.downloadReport(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to download report');
    }
  }
);

export const deleteReport = createAsyncThunk(
  'analytics/deleteReport',
  async (id: string, { rejectWithValue }) => {
    try {
      await analyticsAPI.deleteReport(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete report');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateReportStatus: (state, action) => {
      const { id, status, fileUrl } = action.payload;
      const report = state.reports.find(r => r.id === id);
      if (report) {
        report.status = status;
        if (fileUrl) report.fileUrl = fileUrl;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sales Analytics
      .addCase(fetchSalesAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.salesAnalytics = action.payload;
        state.error = null;
      })
      .addCase(fetchSalesAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Reports
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.reports = action.payload.reports || action.payload;
      })
      // Generate Report
      .addCase(generateReport.pending, (state) => {
        state.reportGenerating = true;
        state.error = null;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.reportGenerating = false;
        state.reports.unshift(action.payload);
        state.error = null;
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.reportGenerating = false;
        state.error = action.payload as string;
      })
      // Delete Report
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter(report => report.id.toString() !== action.payload);
      });
  },
});

export const { clearError, updateReportStatus } = analyticsSlice.actions;
export default analyticsSlice.reducer;
