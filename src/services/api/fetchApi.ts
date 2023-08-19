import { IAvailability } from "@/interfaces/availability.interface";
import { IBenefit } from "@/interfaces/benefit.interface";
import { IRole } from "@/interfaces/role.interface";
import { ISchooling } from "@/interfaces/schooling.interface";
import { ISkill } from "@/interfaces/skill.interface";
import { IUnit } from "@/interfaces/unit.interface";
import { BASE_URL } from "@/utils/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { redirect } from "next/navigation";

const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

export const fetchApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: headers => {
      const token = getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        redirect("/login");
      }

      headers.set("ngrok-skip-browser-warning", "true");
      return headers;
    },
  }),
  endpoints: builder => ({
    getAllProcess: builder.query<any, { page: number; size: number }>({
      query: ({ page, size }) => ({
        url: "/process/findAll",
        params: {
          page,
          size,
        },
      }),
    }),
    createProcess: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        const formData = new FormData();
        formData.append("body", JSON.stringify(data));
        formData.append("banner", data.file);

        return {
          url: "/process",
          method: "POST",
          body: formData,
        };
      },
    }),
    deleteProcess: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/process/${id}`,
        method: "DELETE",
      }),
    }),
    getAdminStatistics: builder.query<
      any,
      { startDate?: string; endDate?: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: "/admin-statistics",
        params: {
          startDate,
          endDate,
        },
      }),
    }),
    getAllUnits: builder.query<
      { units: IUnit[] },
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: "/unit/findAll",
        params: {
          page,
          size,
        },
      }),
    }),
    getAllRoles: builder.query<
      { roles: IRole[] },
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: "/role/findAll",
        params: {
          page,
          size,
        },
      }),
    }),
    getAllAvailabilities: builder.query<
      { availabilities: IAvailability[] },
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: "/availability/findAll",
        params: {
          page,
          size,
        },
      }),
    }),
    getAllSchoolings: builder.query<
      { schoolings: ISchooling[] },
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: "/schooling/findAll",
        params: {
          page,
          size,
        },
      }),
    }),
    getAllSkills: builder.query<
      { skills: ISkill[] },
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: "/skill/findAll",
        params: {
          page,
          size,
        },
      }),
    }),
    getAllBenefits: builder.query<
      { benefits: IBenefit[] },
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: "/benefit/findAll",
        params: {
          page,
          size,
        },
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAllProcessQuery,
  useCreateProcessMutation,
  useDeleteProcessMutation,
  useGetAdminStatisticsQuery,
  useGetAllUnitsQuery,
  useGetAllRolesQuery,
  useGetAllAvailabilitiesQuery,
  useGetAllSchoolingsQuery,
  useGetAllSkillsQuery,
  useGetAllBenefitsQuery,
} = fetchApi;
