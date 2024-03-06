import { createAsyncThunk } from '@reduxjs/toolkit';
import { CategoriesType } from '../../types';
import axiosApi from '../../axiosApi';

export const fetchCategories = createAsyncThunk<CategoriesType[]>('categories/fetchAll', async () => {
  try {
    const response = await axiosApi.get<CategoriesType[]>('/categories');
    return response.data;
  } catch {
    throw new Error();
  }
});

export const fetchOneCategories = createAsyncThunk<CategoriesType, string>('categories/fetchOne', async (id) => {
  try {
    const response = await axiosApi.get<CategoriesType>('/categories/' + id);
    return response.data;
  } catch {
    throw new Error();
  }
});
