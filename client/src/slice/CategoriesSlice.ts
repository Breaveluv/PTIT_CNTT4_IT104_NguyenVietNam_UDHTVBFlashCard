// Updated CategoriesSlice.ts - Fixed API response handling
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

export interface Category {
  id: number;
  name: string;
  topic: string;
  createdAt: string;
}

interface CategoryPayload {
  name: string;
  topic: string;
}

interface CategoriesState {
  loading: boolean;
  error: string | null;
  data: Category[];
}

const initialState: CategoriesState = {
  loading: false,
  error: null,
  data: [],
};

export const getCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: { message: string } }
>(
  'categories/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Category[]>('http://localhost:8080/categories');
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue({ 
        message: (error.response?.data as any)?.message || 'Lấy danh mục thất bại!' 
      });
    }
  }
);

export const createCategory = createAsyncThunk<
  Category,
  CategoryPayload,
  { rejectValue: { message: string } }
>(
  'categories/createCategory',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post<Category>('http://localhost:8080/categories', payload);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue({ 
        message: (error.response?.data as any)?.message || 'Thêm danh mục thất bại!' 
      });
    }
  }
);

// Optional: Thunks for update and delete
export const updateCategory = createAsyncThunk<
  Category,
  { id: number } & CategoryPayload,
  { rejectValue: { message: string } }
>(
  'categories/updateCategory',
  async (payload, { rejectWithValue }) => {
    try {
      const { id, ...data } = payload;
     const response = await axios.put<Category>(`http://localhost:8080/categories/${id}`, data);
return response.data; 
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue({ 
        message: (error.response?.data as any)?.message || 'Cập nhật danh mục thất bại!' 
      });
    }
  }
);

export const deleteCategory = createAsyncThunk<
  number,
  number,
  { rejectValue: { message: string } }
>(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      // Bỏ check response.data.success, chỉ await delete (axios tự throw nếu lỗi status)
      await axios.delete(`http://localhost:8080/categories/${id}`);
      return id;  // Thành công → fulfilled, filter data
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue({ 
        message: (error.response?.data as any)?.message || 'Xóa danh mục thất bại!' 
      });
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Lấy danh mục thất bại!';
      })
      // POST
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Thêm danh mục thất bại!';
      })
      // PUT
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((cat) => cat.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Cập nhật danh mục thất bại!';
      })
      // DELETE
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((cat) => cat.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Xóa danh mục thất bại!';
      });
  },
});

export const { clearError } = categoriesSlice.actions;

export default categoriesSlice.reducer;