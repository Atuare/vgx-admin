import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils/config";
import { userApi } from "./userApi";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/employee/auth/` }),
  endpoints: builder => ({
    login: builder.mutation<{ access_token: string; status: string }, void>({
      query: body => ({
        url: "login",
        method: "POST",
        body,
        credentials: "include",
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(userApi.endpoints.getLoggedUser.initiate(null));
        } catch (error) {}
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "logout",
        credentials: "include",
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
