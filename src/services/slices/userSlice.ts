import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

type TUserState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  request: boolean;
  error: string | null;
  updateError: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  request: false,
  error: null,
  updateError: null
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async () => {
    if (!getCookie('accessToken')) return null;

    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      clearTokens();
      throw error;
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  try {
    await logoutApi();
  } finally {
    clearTokens();
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
      state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.request = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.request = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.request = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.request = false;
        state.error = action.error.message || 'Ошибка авторизации';
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = Boolean(action.payload);
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.request = true;
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.request = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.request = false;
        state.updateError =
          action.error.message || 'Не удалось обновить профиль';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
