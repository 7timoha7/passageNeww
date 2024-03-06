import { createSlice } from '@reduxjs/toolkit';
import { GlobalSuccess, ProductForOneCategoryType, ProductForOneType, ProductForType } from '../../types';
import { RootState } from '../../app/store';
import {
  createProductsFor,
  deleteProductsFor,
  fetchProductsFor,
  fetchProductsForOne,
  fetchProductsForOneCategory,
  updateProductsFor,
} from './productsForThunks';

interface ProductsForState {
  productsFor: ProductForType[];
  productsForOne: ProductForOneType | null;
  productsForOneCategory: ProductForOneCategoryType | null;
  productsForSuccess: GlobalSuccess | null;
  fetchProductsForLoading: boolean;
  fetchProductsForOneLoading: boolean;
  fetchProductsForOneCategoryLoading: boolean;
  createProductsForLoading: boolean;
  deleteProductsForLoading: boolean;
  updateProductsForLoading: boolean;
  productsForID: string | null;
}

const initialState: ProductsForState = {
  productsFor: [],
  productsForOne: null,
  productsForOneCategory: null,
  productsForSuccess: null,
  fetchProductsForLoading: false,
  fetchProductsForOneLoading: false,
  fetchProductsForOneCategoryLoading: false,
  createProductsForLoading: false,
  deleteProductsForLoading: false,
  updateProductsForLoading: false,
  productsForID: null,
};

export const productsForSLice = createSlice({
  name: 'productsFor',
  initialState,
  reducers: {
    setProductsForOneCategoriesNull: (state) => {
      state.productsForOneCategory = null;
    },
    setProductsForID: (state, action) => {
      state.productsForID = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createProductsFor.fulfilled, (state, { payload: success }) => {
      state.createProductsForLoading = false;
      state.productsForSuccess = success;
    });
    builder.addCase(createProductsFor.pending, (state) => {
      state.createProductsForLoading = true;
    });
    builder.addCase(createProductsFor.rejected, (state) => {
      state.createProductsForLoading = false;
    });

    builder.addCase(fetchProductsFor.pending, (state) => {
      state.fetchProductsForLoading = true;
    });
    builder.addCase(fetchProductsFor.fulfilled, (state, action) => {
      state.productsFor = action.payload;
      state.fetchProductsForLoading = false;
    });
    builder.addCase(fetchProductsFor.rejected, (state) => {
      state.fetchProductsForLoading = false;
    });

    builder.addCase(fetchProductsForOne.pending, (state) => {
      state.fetchProductsForOneLoading = true;
    });
    builder.addCase(fetchProductsForOne.fulfilled, (state, action) => {
      state.productsForOne = action.payload;
      state.fetchProductsForOneLoading = false;
    });
    builder.addCase(fetchProductsForOne.rejected, (state) => {
      state.fetchProductsForOneLoading = false;
    });

    builder.addCase(fetchProductsForOneCategory.pending, (state) => {
      state.fetchProductsForOneCategoryLoading = true;
    });
    builder.addCase(fetchProductsForOneCategory.fulfilled, (state, action) => {
      state.productsForOneCategory = action.payload || null;
      state.fetchProductsForOneCategoryLoading = false;
    });
    builder.addCase(fetchProductsForOneCategory.rejected, (state) => {
      state.fetchProductsForOneCategoryLoading = false;
    });

    builder.addCase(updateProductsFor.pending, (state) => {
      state.updateProductsForLoading = true;
    });
    builder.addCase(updateProductsFor.fulfilled, (state, { payload: success }) => {
      state.productsForSuccess = success;
      state.updateProductsForLoading = false;
    });
    builder.addCase(updateProductsFor.rejected, (state) => {
      state.updateProductsForLoading = false;
    });

    builder.addCase(deleteProductsFor.fulfilled, (state, { payload: success }) => {
      state.deleteProductsForLoading = false;
      state.productsForSuccess = success;
    });
    builder.addCase(deleteProductsFor.pending, (state) => {
      state.deleteProductsForLoading = true;
    });
    builder.addCase(deleteProductsFor.rejected, (state) => {
      state.deleteProductsForLoading = false;
    });
  },
});

export const { setProductsForOneCategoriesNull, setProductsForID } = productsForSLice.actions;

export const productsForReducer = productsForSLice.reducer;

export const selectProductsFor = (state: RootState) => state.productsFor.productsFor;
export const selectProductsForOne = (state: RootState) => state.productsFor.productsForOne;
export const selectProductsForOneCategory = (state: RootState) => state.productsFor.productsForOneCategory;
export const selectProductsForSuccess = (state: RootState) => state.productsFor.productsForSuccess;
export const selectFetchProductsForLoading = (state: RootState) => state.productsFor.fetchProductsForLoading;
export const selectFetchProductsForOneLoading = (state: RootState) => state.productsFor.fetchProductsForOneLoading;
export const selectFetchProductsForOneCategoryLoading = (state: RootState) =>
  state.productsFor.fetchProductsForOneCategoryLoading;
export const selectProductsForID = (state: RootState) => state.productsFor.productsForID;
export const selectCreateProductsForLoading = (state: RootState) => state.productsFor.createProductsForLoading;

export const selectUpdateProductsForLoading = (state: RootState) => state.productsFor.updateProductsForLoading;
export const selectDeleteProductsForLoading = (state: RootState) => state.productsFor.deleteProductsForLoading;
