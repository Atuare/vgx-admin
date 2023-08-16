import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils/config";
import { userApi } from "./userApi";
import { LoginInput } from "@/app/login/page";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/employee/auth/`,
    headers: { "ngrok-skip-browser-warning": "true" },
  }),
  endpoints: builder => ({
    login: builder.mutation<
      { access_token: string; status: string },
      LoginInput
    >({
      query: body => ({
        url: "login",
        method: "POST",
        body,
        // credentials: "include",
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data.access_token) {
            localStorage.setItem("access_token", data.access_token);
          }

          await dispatch(userApi.endpoints.getLoggedUser.initiate(null));
        } catch (error) {}
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "logout", // this route doesn't exist
        // credentials: "include",
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
