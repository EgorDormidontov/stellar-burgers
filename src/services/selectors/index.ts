import type { RootState } from '../store';

export const selectIngredientsState = (state: RootState) => state.ingredients;
export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectConstructor = (state: RootState) => state.burgerConstructor;
export const selectFeed = (state: RootState) => state.feed;
export const selectUserState = (state: RootState) => state.user;
export const selectUser = (state: RootState) => state.user.user;
export const selectUserName = (state: RootState) => state.user.user?.name;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUpdateUserError = (state: RootState) =>
  state.user.updateError;
export const selectOrders = (state: RootState) => state.orders;
export const selectCurrentOrder = (state: RootState) => state.currentOrder;
