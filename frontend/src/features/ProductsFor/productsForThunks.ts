import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  GlobalSuccess,
  ProductForOneCategoryType,
  ProductForOneType,
  ProductForToServer,
  ProductForType,
} from '../../types';
import axiosApi from '../../axiosApi';

export const createProductsFor = createAsyncThunk<GlobalSuccess, ProductForToServer>(
  'productsFor/createProductsFor',
  async (productsFor) => {
    try {
      const response = await axiosApi.post('/productsFor', productsFor);
      return response.data;
    } catch {
      throw new Error();
    }
  },
);

export const fetchProductsFor = createAsyncThunk<ProductForType[]>('productsFor/fetchProductsFor', async () => {
  try {
    const response = await axiosApi.get<ProductForType[]>('/productsFor');
    return response.data;
  } catch {
    throw new Error();
  }
});

export const fetchProductsForOne = createAsyncThunk<ProductForOneType, string>(
  'productsFor/fetchProductsForOne',
  async (id) => {
    try {
      const response = await axiosApi.get<ProductForOneType>('/productsFor/' + id);
      return response.data;
    } catch {
      throw new Error();
    }
  },
);

export const fetchProductsForOneCategory = createAsyncThunk<ProductForOneCategoryType, string>(
  'productsFor/fetchProductsForOneCategory',
  async (id) => {
    try {
      const response = await axiosApi.get<ProductForOneCategoryType>('/productsFor/one/' + id);
      return response.data;
    } catch {
      throw new Error();
    }
  },
);

export const updateProductsFor = createAsyncThunk<GlobalSuccess, ProductForToServer>(
  'productsFor/updateProductsFor',
  async (ProductForToServer) => {
    try {
      const response = await axiosApi.patch(`/productsFor/${ProductForToServer.categoryID}`, {
        categoryForID: ProductForToServer.categoryForID,
      });
      return response.data;
    } catch {
      throw new Error();
    }
  },
);

export const deleteProductsFor = createAsyncThunk<GlobalSuccess, string>(
  'productsFor/deleteProductsFor',
  async (bestseller_id) => {
    try {
      const response = await axiosApi.delete('/bestsellers/' + bestseller_id);
      return response.data;
    } catch {
      throw new Error();
    }
  },
);
