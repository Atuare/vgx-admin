import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils/config";
import { IUser } from "@/interfaces/user.interface";
import { setUser } from "@/features/user/userSlice";

const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/employee-user/`,
    prepareHeaders: headers => {
      const accessToken = getAccessToken();
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: builder => ({
    getLoggedUser: builder.query<IUser, null>({
      query: () => ({
        url: "findLogged",
      }),
      transformResponse: (result: { data: IUser }) => {
        return result.data;
      },

      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {}
      },
    }),
  }),
});

export const { useGetLoggedUserQuery } = userApi;
