// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Initial state with token from cookies if available
const initialState = {
  user: null,
  token: Cookies.get('token') || null,
  isAuthenticated: !!Cookies.get('token'),
  isLoading: false,
  error: null,
};

// Register user action
export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:4000/api/v1/user/register', userData, { withCredentials: true });
    Cookies.set('token', response.data.token);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Login user action
export const loginUser = createAsyncThunk('auth/loginUser', async (loginData, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:4000/api/v1/user/login', loginData, { withCredentials: true });
    Cookies.set('token', response.data.token);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      Cookies.remove('token');
    },
    loadUserFromCookies: (state) => {
      const token = Cookies.get('token');
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  }
});

export const { logout, loadUserFromCookies } = authSlice.actions;

export default authSlice.reducer;
