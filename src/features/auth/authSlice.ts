import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  isAuth: boolean;
  user: any | null;
  token?: string | null;
}

const initialState: AuthState = {
  isAuth: false,
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      const { user, token } = action.payload;
      state.isAuth = true;
      state.user = user;
      state.token = token;
    },
    logout: state => {
      state.isAuth = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
