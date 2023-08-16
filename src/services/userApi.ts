import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { BASE_URL } from "@/utils/config";
import { IUser } from "@/interfaces/user.interface";
import { setUser } from "@/features/user/userSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/employee-user/`,
  }),
  tagTypes: ["User"],
  endpoints: builder => ({
    getLoggedUser: builder.query<IUser, null>({
      query: () => ({
        url: "findLogged",
        credentials: "include",
      }),
      transformResponse: (result: { data: { user: IUser } }) =>
        result.data.user,

      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {}
      },
    }),
  }),
});
