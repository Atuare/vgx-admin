import { IAvailability } from "@/interfaces/availability.interface";
import { IBenefit } from "@/interfaces/benefit.interface";
import { IRole } from "@/interfaces/role.interface";
import { ISalaryClaim } from "@/interfaces/salaryClaim.interface";
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
    getProcessCandidates: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/process/${id}/candidates`,
      }),
    }),
    getProcessBanner: builder.query<any, { bannerName: string }>({
      query: ({ bannerName }) => ({
        url: `/process/banner/${bannerName}`,
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
    updateProcess: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        const formData = new FormData();
        formData.append("body", JSON.stringify(data));
        if (data.file) {
          formData.append("banner", data.file);
        }

        return {
          url: "/process",
          method: "PUT",
          body: formData,
        };
      },
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
      { units: IUnit[]; totalCount: number },
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
      { roles: IRole[]; totalCount: number },
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
      { availabilities: IAvailability[]; totalCount: number },
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
      { schoolings: ISchooling[]; totalCount: number },
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
      { skills: ISkill[]; totalCount: number },
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
      { benefits: IBenefit[]; totalCount: number },
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
    getAllSalaryClaim: builder.query<
      { benefits: ISalaryClaim[]; totalCount: number },
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: "/salary-claim/findAll",
        params: {
          page,
          size,
        },
      }),
    }),
    updateUnit: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/unit",
          method: "PUT",
          body: data,
        };
      },
    }),
    updateRole: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/role",
          method: "PUT",
          body: data,
        };
      },
    }),
    updateSkill: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/skill",
          method: "PUT",
          body: data,
        };
      },
    }),
    updateSalaryClaim: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/salary-claim",
          method: "PUT",
          body: data,
        };
      },
    }),
    updateAvailability: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/availability",
          method: "PUT",
          body: data,
        };
      },
    }),
    updateSchooling: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/schooling",
          method: "PUT",
          body: data,
        };
      },
    }),
    updateUser: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/employee",
          method: "PUT",
          body: data,
        };
      },
    }),
    deleteUnit: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/unit`,
        method: "DELETE",
        body: { id },
      }),
    }),
    deleteRole: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/role`,
        method: "DELETE",
        body: { id },
      }),
    }),
    deleteSkill: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/skill`,
        method: "DELETE",
        body: { id },
      }),
    }),
    deleteSalaryClaim: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/salary-claim`,
        method: "DELETE",
        body: { id },
      }),
    }),
    deleteAvaliabilities: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/avaliabilities`,
        method: "DELETE",
        body: { id },
      }),
    }),
    deleteSchooling: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/schooling`,
        method: "DELETE",
        body: { id },
      }),
    }),
    createSkill: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/skill",
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAllProcessQuery,
  useGetProcessCandidatesQuery,
  useGetProcessBannerQuery,
  useCreateProcessMutation,
  useDeleteProcessMutation,
  useUpdateProcessMutation,
  useUpdateUserMutation,
  useGetAdminStatisticsQuery,
  useGetAllUnitsQuery,
  useGetAllRolesQuery,
  useGetAllAvailabilitiesQuery,
  useGetAllSchoolingsQuery,
  useGetAllSkillsQuery,
  useGetAllBenefitsQuery,
  useGetAllSalaryClaimQuery,
  useUpdateUnitMutation,
  useUpdateRoleMutation,
  useUpdateSkillMutation,
  useUpdateSalaryClaimMutation,
  useUpdateAvailabilityMutation,
  useUpdateSchoolingMutation,
  useDeleteUnitMutation,
  useDeleteRoleMutation,
  useDeleteSkillMutation,
  useDeleteSalaryClaimMutation,
  useDeleteAvaliabilitiesMutation,
  useDeleteSchoolingMutation,
  useCreateSkillMutation,
} = fetchApi;
