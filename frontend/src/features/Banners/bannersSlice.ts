import { createSlice } from '@reduxjs/toolkit';
import { BannerType, GlobalSuccess } from '../../types';
import { RootState } from '../../app/store';
import { createBanners, deleteBanners, fetchBanners } from './bannersThunks';
import { productsSLice } from '../Products/productsSlise';

interface BannersState {
  banners: BannerType[];
  bannersSuccess: GlobalSuccess | null;
  fetchBannersLoading: boolean;
  createBannersLoading: boolean;
  deleteBannersLoading: boolean;
}

const initialState: BannersState = {
  banners: [],
  bannersSuccess: null,
  fetchBannersLoading: false,
  createBannersLoading: false,
  deleteBannersLoading: false,
};

export const bannersSLice = createSlice({
  name: 'banners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createBanners.fulfilled, (state, { payload: success }) => {
      state.createBannersLoading = false;
      state.bannersSuccess = success;
    });

    builder.addCase(createBanners.pending, (state) => {
      state.createBannersLoading = true;
    });
    builder.addCase(createBanners.rejected, (state) => {
      state.createBannersLoading = false;
    });

    builder.addCase(fetchBanners.pending, (state) => {
      state.fetchBannersLoading = true;
    });
    builder.addCase(fetchBanners.fulfilled, (state, action) => {
      state.banners = action.payload;
      state.fetchBannersLoading = false;
    });
    builder.addCase(fetchBanners.rejected, (state) => {
      state.fetchBannersLoading = false;
    });

    builder.addCase(deleteBanners.fulfilled, (state, { payload: success }) => {
      state.deleteBannersLoading = false;
      state.bannersSuccess = success;
    });
    builder.addCase(deleteBanners.pending, (state) => {
      state.deleteBannersLoading = true;
    });
    builder.addCase(deleteBanners.rejected, (state) => {
      state.deleteBannersLoading = false;
    });
  },
});

export const bannersReducer = bannersSLice.reducer;

export const selectBanners = (state: RootState) => state.banners.banners;
export const selectBannersSuccess = (state: RootState) => state.banners.bannersSuccess;
export const selectFetchBannersLoading = (state: RootState) => state.banners.fetchBannersLoading;
export const selectCreateBannersLoading = (state: RootState) => state.banners.createBannersLoading;
export const selectDeleteBannersLoading = (state: RootState) => state.banners.deleteBannersLoading;
