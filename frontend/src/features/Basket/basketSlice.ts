import { createSlice } from '@reduxjs/toolkit';
import { createBasket, fetchBasket, updateBasket } from './basketThunks';
import { BasketTypeOnServerMutation, GlobalSuccess, ValidationError } from '../../types';
import { RootState } from '../../app/store';

interface BasketState {
  basket: BasketTypeOnServerMutation | null;
  basketCreateLoading: boolean;
  basketCreateError: ValidationError | null;
  error: boolean;
  basketUpdateLoading: false | string;
  basketSuccess: GlobalSuccess | null;
  basketOneLoading: boolean;
}

const initialState: BasketState = {
  basket: null,
  basketCreateLoading: false,
  basketCreateError: null,
  error: false,
  basketUpdateLoading: false,
  basketSuccess: null,
  basketOneLoading: false,
};

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    setBasketSuccessNull: (state) => {
      state.basketSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createBasket.fulfilled, (state, action) => {
      state.basketCreateLoading = false;
      state.basket = action.payload;
    });
    builder.addCase(createBasket.pending, (state) => {
      state.basketCreateLoading = true;
      state.error = false;
    });
    builder.addCase(createBasket.rejected, (state, { payload: error }) => {
      state.basketCreateLoading = false;
      state.basketCreateError = error || null;
    });

    builder.addCase(updateBasket.fulfilled, (state, { payload: success }) => {
      state.basketUpdateLoading = false;
      state.basketSuccess = success;
      state.error = false;
    });
    builder.addCase(updateBasket.pending, (state, { meta }) => {
      if (meta.arg.product_id) {
        state.basketUpdateLoading = meta.arg.product_id;
      }
      state.error = false;
    });
    builder.addCase(updateBasket.rejected, (state) => {
      state.basketUpdateLoading = false;
      state.error = true;
    });

    builder.addCase(fetchBasket.fulfilled, (state, action) => {
      state.basketOneLoading = false;
      state.basket = action.payload;
      state.error = false;
    });
    builder.addCase(fetchBasket.pending, (state) => {
      state.basketOneLoading = true;
      state.error = false;
    });
    builder.addCase(fetchBasket.rejected, (state) => {
      state.basketOneLoading = false;
      state.error = true;
    });
  },
});
export const basketReducer = basketSlice.reducer;

export const { setBasketSuccessNull } = basketSlice.actions;

export const selectBasket = (state: RootState) => state.basket.basket;
export const selectBasketCreateLoading = (state: RootState) => state.basket.basketCreateLoading;
export const selectBasketUpdateLoading = (state: RootState) => state.basket.basketUpdateLoading;
export const selectBasketOneLoading = (state: RootState) => state.basket.basketOneLoading;
export const selectBasketSuccess = (state: RootState) => state.basket.basketSuccess;
