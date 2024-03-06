import { createSlice } from '@reduxjs/toolkit';
import { GlobalSuccess, ProductType } from '../../types';
import { createBestseller, deleteBestseller, fetchBestsellers } from './bestsellersThunks';
import { RootState } from '../../app/store';

interface BestsellersState {
  bestsellers: ProductType[];
  bestsellerSuccess: GlobalSuccess | null;
  fetchBestsellersLoading: boolean;
  createBestsellerLoading: boolean;
  deleteBestsellerLoading: boolean;
}

const initialState: BestsellersState = {
  bestsellers: [],
  bestsellerSuccess: null,
  fetchBestsellersLoading: false,
  createBestsellerLoading: false,
  deleteBestsellerLoading: false,
};

export const bestsellersSLice = createSlice({
  name: 'bestsellers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createBestseller.fulfilled, (state, { payload: success }) => {
      state.createBestsellerLoading = false;
      state.bestsellerSuccess = success;
    });

    builder.addCase(createBestseller.pending, (state) => {
      state.createBestsellerLoading = true;
    });
    builder.addCase(createBestseller.rejected, (state) => {
      state.createBestsellerLoading = false;
    });

    builder.addCase(fetchBestsellers.pending, (state) => {
      state.fetchBestsellersLoading = true;
    });
    builder.addCase(fetchBestsellers.fulfilled, (state, action) => {
      state.bestsellers = action.payload;
      state.fetchBestsellersLoading = false;
    });
    builder.addCase(fetchBestsellers.rejected, (state) => {
      state.fetchBestsellersLoading = false;
    });

    builder.addCase(deleteBestseller.fulfilled, (state, { payload: success }) => {
      state.deleteBestsellerLoading = false;
      state.bestsellerSuccess = success;
    });
    builder.addCase(deleteBestseller.pending, (state) => {
      state.deleteBestsellerLoading = true;
    });
    builder.addCase(deleteBestseller.rejected, (state) => {
      state.deleteBestsellerLoading = false;
    });
  },
});

export const bestsellersReducer = bestsellersSLice.reducer;

export const selectBestsellers = (state: RootState) => state.bestsellers.bestsellers;
export const selectBestsellerSuccess = (state: RootState) => state.bestsellers.bestsellerSuccess;
export const selectFetchBestsellersLoading = (state: RootState) => state.bestsellers.fetchBestsellersLoading;
export const selectCreateBestsellersLoading = (state: RootState) => state.bestsellers.createBestsellerLoading;
export const selectDeleteBestsellersLoading = (state: RootState) => state.bestsellers.deleteBestsellerLoading;
