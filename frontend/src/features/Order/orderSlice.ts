import { GlobalSuccess, OrderFromServerType, PageInfo } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { changeStatusOrder, deleteOrder, getForAdminHisOrders, getOrders, sendOrder } from './orderThunks';
import { RootState } from '../../app/store';

interface OrdersState {
  sendOrderLoading: boolean;
  sendOrderError: boolean;
  orderSuccess: GlobalSuccess | null;
  fetchOrdersLoading: boolean;
  orders: OrderFromServerType[];
  ordersPageInfo: PageInfo | null;
  changeOrderStatusLoading: string | false;
  deleteOrderLoading: string | false;
  fetchOrdersForAdminLoading: boolean;
  adminMyOrders: OrderFromServerType[];
  adminMyOrdersPageInfo: PageInfo | null;
}

const initialState: OrdersState = {
  sendOrderLoading: false,
  sendOrderError: false,
  orderSuccess: null,
  fetchOrdersLoading: false,
  orders: [],
  ordersPageInfo: null,
  changeOrderStatusLoading: false,
  deleteOrderLoading: false,
  fetchOrdersForAdminLoading: false,
  adminMyOrders: [],
  adminMyOrdersPageInfo: null,
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrderSuccessNull: (state) => {
      state.orderSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendOrder.pending, (state) => {
      state.sendOrderLoading = true;
    });
    builder.addCase(sendOrder.fulfilled, (state, { payload: success }) => {
      state.sendOrderLoading = false;
      state.orderSuccess = success;
    });
    builder.addCase(sendOrder.rejected, (state) => {
      state.sendOrderLoading = false;
      state.sendOrderError = true;
    });

    builder.addCase(getOrders.pending, (state) => {
      state.orders = [];
      state.fetchOrdersLoading = true;
    });
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.fetchOrdersLoading = false;
      state.orders = action.payload.orders;
      state.ordersPageInfo = action.payload.pageInfo;
    });
    builder.addCase(getOrders.rejected, (state) => {
      state.fetchOrdersLoading = false;
    });

    builder.addCase(changeStatusOrder.pending, (state, { meta }) => {
      state.changeOrderStatusLoading = meta.arg.id;
    });
    builder.addCase(changeStatusOrder.fulfilled, (state, { payload: success }) => {
      state.changeOrderStatusLoading = false;
      state.orderSuccess = success;
    });
    builder.addCase(changeStatusOrder.rejected, (state) => {
      state.changeOrderStatusLoading = false;
    });
    builder.addCase(deleteOrder.pending, (state, { meta }) => {
      state.deleteOrderLoading = meta.arg;
    });
    builder.addCase(deleteOrder.fulfilled, (state, { payload: success }) => {
      state.deleteOrderLoading = false;
      state.orderSuccess = success;
    });
    builder.addCase(deleteOrder.rejected, (state) => {
      state.deleteOrderLoading = false;
    });
    builder.addCase(getForAdminHisOrders.pending, (state) => {
      state.adminMyOrders = [];
      state.fetchOrdersForAdminLoading = true;
    });
    builder.addCase(getForAdminHisOrders.fulfilled, (state, action) => {
      state.fetchOrdersForAdminLoading = false;
      state.adminMyOrders = action.payload.orders;
      state.adminMyOrdersPageInfo = action.payload.pageInfo;
    });
    builder.addCase(getForAdminHisOrders.rejected, (state) => {
      state.fetchOrdersForAdminLoading = false;
    });
  },
});

export const ordersReducer = ordersSlice.reducer;

export const { setOrderSuccessNull } = ordersSlice.actions;
export const selectSendOrderLoading = (state: RootState) => state.orders.sendOrderLoading;
export const selectSendOrderError = (state: RootState) => state.orders.sendOrderError;
export const selectFetchOrdersLoading = (state: RootState) => state.orders.fetchOrdersLoading;
export const selectOrders = (state: RootState) => state.orders.orders;

export const selectOrdersPageInfo = (state: RootState) => state.orders.ordersPageInfo;
export const selectOrderChangeStatusLoading = (state: RootState) => state.orders.changeOrderStatusLoading;
export const selectOrderDeleteLoading = (state: RootState) => state.orders.deleteOrderLoading;
export const selectFetchOrdersForAdminLoading = (state: RootState) => state.orders.fetchOrdersForAdminLoading;
export const selectAdminMyOrders = (state: RootState) => state.orders.adminMyOrders;
export const selectAdminMyOrdersPageInfo = (state: RootState) => state.orders.adminMyOrdersPageInfo;
export const selectOrderSuccess = (state: RootState) => state.orders.orderSuccess;
