
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardAPI } from '../../services/api';
import { DashboardStats } from '../../types';

interface DashboardState {
  stats: DashboardStats | null;
  topProducts: any[];
  recentOrders: any[];
  notifications: any[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
}

const initialState: DashboardState = {
  stats: null,
  topProducts: [],
  recentOrders: [],
  notifications: [],
  loading: false,
  error: null,
  lastUpdated: null,
  connectionStatus: 'connected',
};

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await dashboardAPI.getStats();
      return {
        ...response.data.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch dashboard stats';
      
      // Log specific error types for better debugging
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timeout - please check your connection');
      } else if (error.response?.status === 401) {
        return rejectWithValue('Authentication failed - please login again');
      } else if (error.response?.status === 403) {
        return rejectWithValue('Access denied - insufficient permissions');
      } else if (error.response?.status >= 500) {
        return rejectWithValue('Server error - please try again later');
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const addNotification = createAsyncThunk(
  'dashboard/addNotification',
  async (notification: { type: string; message: string; }, { getState }) => {
    return {
      id: Date.now(),
      ...notification,
      time: new Date().toISOString(),
      read: false,
    };
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.connectionStatus = 'reconnecting';
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.topProducts = action.payload.topProducts || [];
        state.recentOrders = action.payload.recentOrders || [];
        state.error = null;
        state.lastUpdated = action.payload.timestamp;
        state.connectionStatus = 'connected';
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.connectionStatus = 'disconnected';
      })
      // Add Notification
      .addCase(addNotification.fulfilled, (state, action) => {
        state.notifications.unshift(action.payload);
        // Keep only last 20 notifications
        if (state.notifications.length > 20) {
          state.notifications = state.notifications.slice(0, 20);
        }
      });
  },
});

export const { 
  clearError, 
  setConnectionStatus, 
  markNotificationAsRead, 
  clearAllNotifications,
  updateStats 
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
