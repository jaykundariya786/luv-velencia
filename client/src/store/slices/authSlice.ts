import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  provider: 'email' | 'google' | 'apple';
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await authAPI.login(email, password);
    localStorage.setItem('user', JSON.stringify(response));
    return response;
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ email, password, name }: { email: string; password: string; name: string }) => {
    const response = await authAPI.signup(email, password, name);
    localStorage.setItem('user', JSON.stringify(response));
    return response;
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async () => {
    const response = await authAPI.loginWithGoogle();
    localStorage.setItem('user', JSON.stringify(response));
    return response;
  }
);

export const loginWithApple = createAsyncThunk(
  'auth/loginWithApple',
  async () => {
    const response = await authAPI.loginWithApple();
    localStorage.setItem('user', JSON.stringify(response));
    return response;
  }
);

export const loadUserFromStorage = createAsyncThunk(
  'auth/loadFromStorage',
  async () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Signup failed';
      })
      // Google login
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Google login failed';
      })
      // Apple login
      .addCase(loginWithApple.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithApple.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginWithApple.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Apple login failed';
      })
      // Load from storage
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      });
  },
});

export const { login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;