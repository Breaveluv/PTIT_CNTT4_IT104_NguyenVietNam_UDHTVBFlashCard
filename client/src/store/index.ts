
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice';
import categoriesReducer from '../slice/CategoriesSlice';
import wordsReducer from '../slice/WordSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    words: wordsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;