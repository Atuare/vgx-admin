import { IAvailability } from "@/interfaces/availability.interface";
import { IBenefit } from "@/interfaces/benefit.interface";
import { ICandidate } from "@/interfaces/candidate.interface";
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
        formData.append("banner", data.banner);

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
    getTrainingById: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/training/${id}`,
        params: {
          id,
        },
      }),
    }),
    createTraining: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/training",
          method: "POST",
          body: data,
        };
      },
    }),
    updateTraining: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        console.log(data);

        return {
          url: "/training",
          method: "PUT",
          body: data,
        };
      },
    }),
    getAllTrainingTypes: builder.query<any, { page: number; size: number }>({
      query: ({ page, size }) => ({
        url: "/training-type/findAll",
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
    releaseAdmissionContract: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/admission/releaseContract",
          method: "POST",
          body: data,
        };
      },
    }),
    createAdmission: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/admission",
          method: "POST",
          body: data,
        };
      },
    }),
    updateAdmission: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: `/admission/${data.id}`,
          method: "PUT",
          body: data,
          params: {
            id: data.id,
          },
        };
      },
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
    getAllDocuments: builder.query<
      any,
      {
        page: number;
        size: number;
        orderBy?: string;
        direction?: "ASC" | "DESC";
      }
    >({
      query: ({ page, size, direction, orderBy }) => ({
        url: "/document/findAll",
        params: {
          page,
          size,
          direction,
          orderBy,
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
    getCandidateById: builder.query<ICandidate, { id: string }>({
      query: ({ id }) => ({
        url: "/candidate/findById",
        params: {
          id,
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
    updateCandidate: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/candidate",
          method: "PUT",
          body: data,
          params: {
            id: data.id,
          },
        };
      },
    }),
    updateCandidateDocuments: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/candidate-documents",
          method: "PUT",
          body: data,
          params: {
            id: data.id,
          },
        };
      },
    }),
    updateCandidateComplementaryInfo: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/candidate-complementary-info",
          method: "PUT",
          body: data,
          params: {
            id: data.id,
          },
        };
      },
    }),
    updateCandidateFormation: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/formation",
          method: "PUT",
          body: data,
          params: {
            id: data.id,
          },
        };
      },
    }),
    updateCandidateAddress: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/candidate-address",
          method: "PUT",
          body: data,
          params: {
            id: data.id,
          },
        };
      },
    }),
    getAllTests: builder.query<
      any,
      {
        page: number;
        size: number;
        orderBy?: string;
        direction?: "ASC" | "DESC";
      }
    >({
      query: ({ page, size, orderBy, direction }) => ({
        url: "/test/findAll",
        params: {
          page,
          size,
          orderBy,
          direction,
        },
      }),
    }),
    createTest: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/test",
          method: "POST",
          body: data,
        };
      },
    }),
    updateTest: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/test",
          method: "PUT",
          body: data,
        };
      },
    }),
    deleteTest: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/test/${id}`,
        method: "DELETE",
        params: {
          id,
        },
      }),
    }),
    getTestById: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/test/id/${id}`,
        params: {
          id,
        },
      }),
    }),
    getAvailabilityById: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/availability/${id}`,
        params: {
          id,
        },
      }),
    }),
    getAllCandidacys: builder.query<
      any,
      {
        page: number;
        size: number;
        orderBy?: string;
        direction?: "ASC" | "DESC";
      }
    >({
      query: ({ page, size, orderBy, direction }) => ({
        url: "/candidacy/findAll",
        params: {
          page,
          size,
          orderBy,
          direction,
        },
      }),
    }),
    updateCandidacyCandidate: builder.mutation<
      any,
      { id: string; data: Record<string, string> }
    >({
      query: ({ id, data }) => ({
        url: `/candidacy/${id}/updateCandidate`,
        method: "PATCH",
        body: data,
        params: {
          id,
        },
      }),
    }),
    getAllExams: builder.query<any, any>({
      query: () => ({
        url: `exams/`,
      }),
    }),
    getAllExaminers: builder.query<any, any>({
      query: () => ({
        url: `exams/examiners`,
      }),
    }),
    getAllExamClass: builder.query<
      any,
      {
        id: string;
      }
    >({
      query: ({ id }) => ({
        url: `exams/${id}/class`,
      }),
    }),
    getExamById: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/exams/${id}`,
        params: {
          id,
        },
      }),
    }),
    createExam: builder.mutation<any, { data: Record<any, any> }>({
      query: ({ data }) => ({
        url: `/exams/`,
        method: "POST",
        body: data,
      }),
    }),
    updateExam: builder.mutation<
      any,
      { examId: string; data: Record<any, any> }
    >({
      query: ({ examId, data }) => ({
        url: `/exams/${examId}`,
        method: "PUT",
        body: data,
      }),
    }),
    updateExamStatus: builder.mutation<
      any,
      { examId: string; data: Record<any, any> }
    >({
      query: ({ examId, data }) => ({
        url: `/exams/${examId}`,
        method: "PATCH",
        body: data,
      }),
    }),
    updateExamClassesCandidacyStatus: builder.mutation<
      any,
      { examId: string; data: Record<any, any> }
    >({
      query: ({ examId, data }) => ({
        url: `/exams/${examId}/classes`,
        method: "PATCH",
        body: data,
      }),
    }),
    sendShutdownSpreadsheet: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/subscription/shutdown",
          method: "POST",
          body: data,
        };
      },
    }),
    sendEmployeeSpreadsheet: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/subscription/employee",
          method: "POST",
          body: data,
        };
      },
    }),
    sendJuridicalSpreadsheet: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/subscription/juridical",
          method: "POST",
          body: data,
        };
      },
    }),
    sendMisSpreadsheet: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/subscription/mis",
          method: "POST",
          body: data,
        };
      },
    }),
    getSubscriptionSettings: builder.query({
      query: () => ({
        url: `/subscription-settings`,
      }),
    }),
    updateSubscriptionSettings: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/subscription-settings",
          method: "PUT",
          body: data,
        };
      },
    }),
    getInterviewSettings: builder.query<any, { skip?: number; take?: number }>({
      query: ({ skip, take }) => ({
        url: `/interview-settings`,
        params: {
          skip,
          take,
        },
      }),
    }),
    getInterviewSettingsById: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/interview-settings/${id}`,
        params: {
          id,
        },
      }),
    }),
    updateInterviewSetting: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: `/interview-settings/${data.id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    createInterviewSetting: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/interview-settings",
          method: "POST",
          body: data,
        };
      },
    }),
    deleteInterviewSetting: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/interview-settings/${id}`,
        method: "DELETE",
        params: { id },
      }),
    }),
    updateInterviewSchedulings: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: `/interview-settings/${data.id}/schedulings`,
          method: "PUT",
          body: {
            data: data.schedulings,
          },
          params: {
            id: data.id,
          },
        };
      },
    }),
    updateInterviewDates: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: `/interview-settings/${data.id}/dates`,
          method: "PUT",
          body: {
            data: data.dates,
          },
          params: {
            id: data.id,
          },
        };
      },
    }),
    createSignatureDocument: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/signature",
          method: "POST",
          body: data,
        };
      },
    }),
    createSignatureSigner: builder.mutation<any, any>({
      query: (data: Record<string, string>) => {
        return {
          url: "/signature/signer",
          method: "POST",
          body: data,
        };
      },
    }),
    getAllSignatureSigners: builder.query<any, any>({
      query: () => ({
        url: `/signature/signer`,
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
  useGetTrainingByIdQuery,
  useCreateTrainingMutation,
  useGetAllTrainingTypesQuery,
  useUpdateTrainingMutation,
  useGetAllAdmissionsQuery,
  useGetAdmissionQuery,
  useCreateAdmissionMutation,
  useUpdateAdmissionMutation,
  useChangeEmployeePasswordMutation,
  useGetAllDocumentsQuery,
  useDeleteDocumentMutation,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useGetAllCandidatesQuery,
  useGetCandidateByIdQuery,
  useGetAllContractsQuery,
  useCreateContractMutation,
  useUpdateContractMutation,
  useDeleteContractMutation,
  useUpdateCandidateDocumentsMutation,
  useUpdateCandidateAddressMutation,
  useUpdateCandidateComplementaryInfoMutation,
  useUpdateCandidateFormationMutation,
  useUpdateCandidateMutation,
  useGetAllTestsQuery,
  useCreateTestMutation,
  useUpdateTestMutation,
  useDeleteTestMutation,
  useGetTestByIdQuery,
  useGetAvailabilityByIdQuery,
  useGetAllCandidacysQuery,
  useReleaseAdmissionContractMutation,
  useUpdateCandidacyCandidateMutation,
  useGetAllExamsQuery,
  useGetAllExaminersQuery,
  useGetAllExamClassQuery,
  useGetExamByIdQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useUpdateExamStatusMutation,
  useUpdateExamClassesCandidacyStatusMutation,
  useSendEmployeeSpreadsheetMutation,
  useSendJuridicalSpreadsheetMutation,
  useSendMisSpreadsheetMutation,
  useSendShutdownSpreadsheetMutation,
  useGetSubscriptionSettingsQuery,
  useUpdateSubscriptionSettingsMutation,
  useGetInterviewSettingsQuery,
  useUpdateInterviewSettingMutation,
  useCreateInterviewSettingMutation,
  useGetInterviewSettingsByIdQuery,
  useDeleteInterviewSettingMutation,
  useUpdateInterviewDatesMutation,
  useUpdateInterviewSchedulingsMutation,
  useCreateSignatureDocumentMutation,
  useGetAllSignatureSignersQuery,
} = fetchApi;
