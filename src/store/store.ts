import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/services/api/authApi";
import { userApi } from "@/services/api/userApi";
import { fetchApi } from "@/services/api/fetchApi";
import userReducer from "@/features/user/userSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [fetchApi.reducerPath]: fetchApi.reducer,
    userState: userReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      fetchApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
