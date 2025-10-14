// Updated authSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  role: string;
}

interface RegisterResponse {
  id: string;
  fullName: string;
  email: string;
}

export interface LoginResponse {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  currentUser: LoginResponse | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  currentUser: null,
};

export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterPayload,
  { rejectValue: { message: string } }
>(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post<RegisterResponse>('http://localhost:8080/users', payload);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue({ 
        message: (error.response?.data as any)?.message || 'Đăng ký thất bại!' 
      });
    }
  }
);

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: { message: string } }
>(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
   
      const response = await axios.get<User[]>('http://localhost:8080/users');
      const users = response.data;

      
      const user = users.find(
        (u) => u.email === payload.email && u.password === payload.password
      );

      if (!user) {
        return rejectWithValue({ message: 'Email hoặc mật khẩu không đúng!' });
      }

      // Trả về LoginResponse với role
      const loginResponse: LoginResponse = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      };

      return loginResponse;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue({ 
        message: (error.response?.data as any)?.message || 'Đăng nhập thất bại!' 
      });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.error = null;
      localStorage.removeItem('currentUser'); // Xóa localStorage khi logout
    },
    // Action để restore user từ localStorage khi app load (gọi trong App.tsx)
    setCurrentUser: (state, action: { payload: LoginResponse }) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Đăng ký thất bại!';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentUser = action.payload;
        // Lưu vào localStorage
        localStorage.setItem('currentUser', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Đăng nhập thất bại!';
      });
  },
});

export const { logout, setCurrentUser } = authSlice.actions;

export default authSlice.reducer;