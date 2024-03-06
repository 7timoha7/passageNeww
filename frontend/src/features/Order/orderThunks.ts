import { createAsyncThunk } from '@reduxjs/toolkit';
import { GlobalSuccess, OrderFromServerType, OrderSendType, PageInfo } from '../../types';
import axiosApi from '../../axiosApi';
import { RootState } from '../../app/store';

export const sendOrder = createAsyncThunk<
  GlobalSuccess,
  OrderSendType,
  {
    state: RootState;
  }
>('orders/sendOrder', async (order, { getState }) => {
  const user = getState().users.user;
  try {
    const url = user ? '/orders/user' : '/orders';
    const response = await axiosApi.post(url, order);
    return response.data;
  } catch (e) {
    throw new Error();
  }
});

export const getOrders = createAsyncThunk<{ orders: OrderFromServerType[]; pageInfo: PageInfo }, number>(
  'orders/getOrders',
  async (page) => {
    try {
      const responseOrders = await axiosApi.get<{
        orders: OrderFromServerType[];
        pageInfo: PageInfo;
      }>(`/orders?page=${page}`);
      return responseOrders.data;
    } catch {
      throw new Error();
    }
  },
);

export const getForAdminHisOrders = createAsyncThunk<
  { orders: OrderFromServerType[]; pageInfo: PageInfo },
  {
    id: string;
    page: number;
  }
>('orders/getOrdersForAdmin', async ({ id, page }) => {
  try {
    const responseOrders = await axiosApi.get<{
      orders: OrderFromServerType[];
      pageInfo: PageInfo;
    }>(`/orders?admin=${id}&page=${page}`);
    return responseOrders.data;
  } catch {
    throw new Error();
  }
});

export interface ChangeStatusProps {
  id: string;
  status: string;
}

export const changeStatusOrder = createAsyncThunk<GlobalSuccess, ChangeStatusProps>(
  'orders/changeStatus',
  async (data) => {
    try {
      const response = await axiosApi.patch<GlobalSuccess>('/orders/' + data.id, { status: data.status });
      return response.data;
    } catch {
      throw new Error();
    }
  },
);

export const deleteOrder = createAsyncThunk<GlobalSuccess, string>('orders/deleteOrder', async (id) => {
  try {
    const response = await axiosApi.delete<GlobalSuccess>('/orders/' + id);
    return response.data;
  } catch {
    throw new Error();
  }
});
