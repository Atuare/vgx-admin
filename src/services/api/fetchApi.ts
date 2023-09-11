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
      {
        page: number;
        size: number;
        orderBy?: string;
        direction?: "ASC" | "DESC";
      }
    >({
      query: ({ page, size, orderBy, direction }) => ({
        url: "/unit/findAll",
        params: {
          page,
          size,
          orderBy,
          direction,
        },
      }),
    }),
    getAllRoles: builder.query<
      { roles: IRole[]; totalCount: number },
      {
        page: number;
        size: number;
        orderBy?: string;
        direction?: "ASC" | "DESC";
      }
    >({
      query: ({ page, size, orderBy, direction }) => ({
        url: "/role/findAll",
        params: {
          page,
          size,
          orderBy,
          direction,
        },
      }),
    }),
    getAllAvailabilities: builder.query<
      {
        availabilities: IAvailability[];
        totalCount: number;
      },
      {
        page: number;
        size: number;
        orderBy?: string;
        direction?: "ASC" | "DESC";
      }
    >({
      query: ({ page, size, direction, orderBy }) => ({
        url: "/availability/findAll",
        params: {
          page,
          size,
          direction,
          orderBy,
        },
      }),
    }),
    getAllSchoolings: builder.query<
      { schoolings: ISchooling[]; totalCount: number },
      {
        page: number;
        size: number;
        orderBy?: string;
        direction?: "ASC" | "DESC";
      }
    >({
      query: ({ page, size, direction, orderBy }) => ({
        url: "/schooling/findAll",
        params: {
          page,
          size,
          orderBy,
          direction,
        },
      }),
    }),
    getAllSkills: builder.query<
      { skills: ISkill[]; totalCount: number },
      {
        page: number;
        size: number;
        orderBy?: string;
        direction?: "ASC" | "DESC";
      }
    >({
      query: ({ page, size, direction, orderBy }) => ({
        url: "/skill/findAll",
        params: {
          page,
          size,
          orderBy,
          direction,
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
      { salaryClaims: ISalaryClaim[]; totalCount: number },
      {
        page: number;
        size: number;
        orderBy?: string;
        direction?: "ASC" | "DESC";
      }
    >({
      query: ({ page, size, direction, orderBy }) => ({
        url: "/salary-claim/findAll",
        params: {
          page,
          size,
          orderBy,
          direction,
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
    getAllInterviews: builder.query<any, { page: number; size: number }>({
      query: ({ page, size }) => ({
        url: "/interview/findAll",
        params: {
          page,
          size,
        },
      }),
    }),
    deleteUnit: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/unit/${id}`,
        method: "DELETE",
        params: {
          id,
        },
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
        url: `/salary-claim/${id}`,
        method: "DELETE",
      }),
    }),
    deleteAvaliability: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/availability/${id}`,
        method: "DELETE",
      }),
    }),
    deleteSchooling: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/schooling/${id}`,
        method: "DELETE",
      }),
    }),
    createUnit: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/unit",
          method: "POST",
          body: data,
        };
      },
    }),
    createRole: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/role",
          method: "POST",
          body: data,
        };
      },
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
    createSalaryClaim: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/salary-claim",
          method: "POST",
          body: data,
        };
      },
    }),
    createAvailability: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/availability",
          method: "POST",
          body: data,
        };
      },
    }),
    createSchooling: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/schooling",
          method: "POST",
          body: data,
        };
      },
    }),
    getAllTrainings: builder.query<any, { page: number; size: number }>({
      query: ({ page, size }) => ({
        url: "/training/findAll",
        params: {
          page,
          size,
        },
      }),
    }),
    getAllAdmissions: builder.query<any, { page: number; size: number }>({
      query: ({ page, size }) => ({
        url: "/admission/findAll",
        params: {
          page,
          size,
        },
      }),
    }),
    getAdmission: builder.query<
      any,
      { admissionId: string; page: number; size: number }
    >({
      query: ({ admissionId, page, size }) => ({
        url: `/admission/${admissionId}/results`,
        params: {
          admissionId,
          page,
          size,
        },
      }),
    }),
    changeEmployeePassword: builder.mutation<
      any,
      { password: string; newPassword: string }
    >({
      query: (data: { password: string; newPassword: string }) => {
        return {
          url: "/employee-user/changePassword",
          method: "PUT",
          body: data,
        };
      },
    }),
    getAllDocuments: builder.query<any, { page: number; size: number }>({
      query: ({ page, size }) => ({
        url: "/document/findAll",
        params: {
          page,
          size,
        },
      }),
    }),
    deleteDocument: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/document`,
        method: "DELETE",
        body: { id },
      }),
    }),
    createDocument: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/document",
          method: "POST",
          body: data,
        };
      },
    }),
    updateDocument: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/document",
          method: "PUT",
          body: data,
          params: {
            id: data.id,
          },
        };
      },
    }),
    getAllCandidates: builder.query<any, { page: number; size: number }>({
      query: ({ page, size }) => ({
        url: "/candidate/findAll",
        params: {
          page,
          size,
        },
      }),
    }),
    getAllContracts: builder.query<
      any,
      {
        page: number;
        size: number;
        orderBy?: string;
        direction?: "ASC" | "DESC";
      }
    >({
      query: ({ page, size, orderBy, direction }) => ({
        url: "/contract/findAll",
        params: {
          page,
          size,
          orderBy,
          direction,
        },
      }),
    }),
    createContract: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/contract",
          method: "POST",
          body: data,
        };
      },
    }),
    updateContract: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/contract",
          method: "PUT",
          body: data,
        };
      },
    }),
    deleteContract: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/contract`,
        method: "DELETE",
        body: { id },
      }),
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
  useGetAllInterviewsQuery,
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
  useDeleteAvaliabilityMutation,
  useDeleteSchoolingMutation,
  useCreateUnitMutation,
  useCreateRoleMutation,
  useCreateSkillMutation,
  useCreateSalaryClaimMutation,
  useCreateAvailabilityMutation,
  useCreateSchoolingMutation,
  useGetAllTrainingsQuery,
  useGetAllAdmissionsQuery,
  useGetAdmissionQuery,
  useChangeEmployeePasswordMutation,
  useGetAllDocumentsQuery,
  useDeleteDocumentMutation,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useGetAllCandidatesQuery,
  useGetAllContractsQuery,
  useCreateContractMutation,
  useUpdateContractMutation,
  useDeleteContractMutation,
} = fetchApi;
