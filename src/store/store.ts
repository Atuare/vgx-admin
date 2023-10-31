import examReducer from "@/features/exam/examSlice";
import processEditReducer from "@/features/process/processEditSlice";
import userReducer from "@/features/user/userSlice";
import { authApi } from "@/services/api/authApi";
import { fetchApi } from "@/services/api/fetchApi";
import { userApi } from "@/services/api/userApi";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [fetchApi.reducerPath]: fetchApi.reducer,
    userState: userReducer,
    processEditState: processEditReducer,
    examState: examReducer,
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
