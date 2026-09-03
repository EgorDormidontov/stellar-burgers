import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type TOrdersState = {
  items: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  items: [],
  isLoading: false,
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  getOrdersApi
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось загрузить историю заказов';
      });
  }
});

export const { clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
