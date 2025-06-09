import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name: string;
  provider: 'email' | 'google' | 'apple';
  token?: string;
  firebaseUID?: string;
  photoURL?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Load initial state from localStorage
const loadUserFromStorage = (): User | null => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error loading user from storage:', error);
    return null;
  }
};

const initialState: AuthState = {
  user: loadUserFromStorage(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.user = null;
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
      // Remove from localStorage
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    loadUserFromStorage: (state) => {
      const storedUser = loadUserFromStorage();
      if (storedUser) {
        state.user = storedUser;
      }
    },
    setAuthState: (state, action: PayloadAction<{ user: User | null; isLoading: boolean }>) => {
      state.user = action.payload.user;
      state.isLoading = action.payload.isLoading;
      if (action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      } else {
        localStorage.removeItem('user');
      }
    },
  },
});

export const { 
  setLoading, 
  loginSuccess, 
  loginFailure, 
  logout, 
  clearError, 
  updateUser,
  loadUserFromStorage: loadUserFromStorageAction,
  setAuthState
} = authSlice.actions;

// Export login action for header component
export const login = loginSuccess;

export default authSlice.reducer;