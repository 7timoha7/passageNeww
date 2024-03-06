import { createAsyncThunk } from '@reduxjs/toolkit';
import { GlobalSuccess, ProductType } from '../../types';
import axiosApi from '../../axiosApi';

export const createBestseller = createAsyncThunk<GlobalSuccess, string>(
  'bestsellers/createBestseller',
  async (bestseller_id) => {
    try {
      const response = await axiosApi.post('/bestsellers', { bestseller_id });
      return response.data;
    } catch {
      throw new Error();
    }
  },
);

export const fetchBestsellers = createAsyncThunk<ProductType[]>('bestsellers/fetchBestsellers', async () => {
  try {
    const response = await axiosApi.get<ProductType[]>('/bestsellers');
    return response.data;
  } catch {
    throw new Error();
  }
});

export const deleteBestseller = createAsyncThunk<GlobalSuccess, string>(
  'bestsellers/deleteBestseller',
  async (bestseller_id) => {
    try {
      const response = await axiosApi.delete('/bestsellers/' + bestseller_id);
      return response.data;
    } catch {
      throw new Error();
    }
  },
);
