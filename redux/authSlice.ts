import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AuthState } from '@/types/auth';
import * as SecureStore from 'expo-secure-store';
import { RegisterFormData } from '@/types';

const API_BASE_URL = 'https://school-connect-server.up.railway.app/api/auth';

const initialState: AuthState = {
  user: null,
  token: null,
  error: null,
  loading: false,
};

// Helper functions for SecureStore
const saveSecureItem = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

const getSecureItem = async (key: string) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    return null;
  }
};

const removeSecureItem = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
  }
};

// Initialize auth state
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getSecureItem('token');
      const userString = await getSecureItem('user');
      
      if (token && userString) {
        return {
          token,
          user: JSON.parse(userString)
        };
      }
      return null;
    } catch (error) {
      return rejectWithValue('Failed to initialize auth');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, data);
      
      // Save to SecureStore
      await saveSecureItem('token', response.data.token);
      await saveSecureItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      // More specific error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        switch (error.response.status) {
          case 401:
            return rejectWithValue('Invalid email or password. Please try again.');
          case 404:
            return rejectWithValue('User not found. Please check your credentials.');
          case 403:
            return rejectWithValue('Access denied. Please contact support.');
          case 500:
            return rejectWithValue('Server error. Please try again later.');
          default:
            return rejectWithValue(error.response.data.message || 'Login failed');
        }
      } else if (error.request) {
        // The request was made but no response was received
        return rejectWithValue('No response from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        return rejectWithValue('An unexpected error occurred. Please try again.');
      }
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: RegisterFormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, data);
      
      // Save to SecureStore
      await saveSecureItem('token', response.data.token);
      await saveSecureItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await removeSecureItem('token');
      await removeSecureItem('user');
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize
      .addCase(initializeAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string || 'Login failed';
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;