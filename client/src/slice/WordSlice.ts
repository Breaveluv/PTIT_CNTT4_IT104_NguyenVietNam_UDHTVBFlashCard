import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

export interface Word {
  id: number;
  word: string;
  meaning: string;
  topic: string;
  categoryId?: number;
  isLearned?: boolean;
}

interface WordPayload {
  word: string;
  meaning: string;
  topic: string;
  categoryId?: number;
}

interface WordsState {
  loading: boolean;
  error: string | null;
  data: Word[];
}

const initialState: WordsState = {
  loading: false,
  error: null,
  data: [],
};

export const getWords = createAsyncThunk<Word[], void, { rejectValue: { message: string } }>(
  'words/getWords',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Word[]>('http://localhost:8080/vocab');
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue({ message: (error.response?.data as any)?.message || 'Lấy từ vựng thất bại!' });
    }
  }
);

export const createWord = createAsyncThunk<Word, Omit<WordPayload, 'topic'> & { topic?: string }, { rejectValue: { message: string } }>(
  'words/createWord',
  async (payload, { rejectWithValue }) => {
    try {
      const postPayload = {
        ...payload,
        topic: payload.topic || '', 
        isLearned: false
      };
      const response = await axios.post<Word>('http://localhost:8080/vocab', postPayload);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue({ message: (error.response?.data as any)?.message || 'Thêm từ vựng thất bại!' });
    }
  }
);

export const updateWord = createAsyncThunk<Word, { id: number } & Omit<WordPayload, 'topic'> & { topic?: string }, { rejectValue: { message: string } }>(
  'words/updateWord',
  async (payload, { rejectWithValue }) => {
    try {
      const { id, ...data } = payload;
      const updatePayload = {
        ...data,
        topic: data.topic || '', 
        isLearned: data.isLearned ?? false 
      };
      const response = await axios.put<Word>(`http://localhost:8080/vocab/${id}`, updatePayload);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue({ message: (error.response?.data as any)?.message || 'Cập nhật từ vựng thất bại!' });
    }
  }
);

export const deleteWord = createAsyncThunk<number, number, { rejectValue: { message: string } }>(
  'words/deleteWord',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:8080/vocab/${id}`);
      return id;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue({ message: (error.response?.data as any)?.message || 'Xóa từ vựng thất bại!' });
    }
  }
);

const wordsSlice = createSlice({
  name: 'words',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWords.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getWords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Lấy từ vựng thất bại!';
      })
      .addCase(createWord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWord.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(createWord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Thêm từ vựng thất bại!';
      })
      .addCase(updateWord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWord.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((w) => w.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateWord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Cập nhật từ vựng thất bại!';
      })
      .addCase(deleteWord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWord.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((w) => w.id !== action.payload);
      })
      .addCase(deleteWord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Xóa từ vựng thất bại!';
      });
  },
});

export default wordsSlice.reducer;