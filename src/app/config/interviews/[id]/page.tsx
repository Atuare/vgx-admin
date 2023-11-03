"use client";
import { ConfigInterviewForm } from "@/components/ConfigInterviews/Form";
import { ICreateInterview } from "@/interfaces/configInterviews.interface";
import {
  useGetInterviewSettingsByIdQuery,
  useUpdateInterviewDatesMutation,
  useUpdateInterviewSchedulingsMutation,
  useUpdateInterviewSettingMutation,
} from "@/services/api/fetchApi";
import { Toast } from "@/utils/toast";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const convertInterviewType = {
  REMOTE: "Remoto",
  PERSON: "Presencial",
};

export default function InterviewsEditPage() {
  const [defaultInterview, setDefaultInterview] = useState<ICreateInterview>();
  const [updateInterview] = useUpdateInterviewSettingMutation();
  const [updateInterviewSchedulings] = useUpdateInterviewSchedulingsMutation();
  const [updateInterviewDates] = useUpdateInterviewDatesMutation();

  const params = useParams();
  const { push } = useRouter();

  const interviewId = Array.from(params.id).join("");

  const { data, isSuccess, isFetching, refetch } =
    useGetInterviewSettingsByIdQuery({
      id: interviewId,
    });

  const handleUpdateInterview = (data: any) => {
    updateInterview(data).then(interviewData => {
      if ("error" in interviewData) {
        Toast("error", "Erro ao atualizar a seção geral.");
      } else {
        Toast("success", "Seção geral atualizada com sucesso.");
      }

      updateInterviewSchedulings({
        id: interviewId,
        schedulings: data.schedulings,
      }).then(schedulings => {
        if ("error" in schedulings) {
          Toast(
            "error",
            "Erro ao atualizar os horários e limites de agendamento.",
          );
        } else {
          Toast(
            "success",
            "Horários e limites de agendamento atualizado com sucesso.",
          );
        }

        updateInterviewDates({
          id: interviewId,
          dates: data.dates,
        }).then(dates => {
          if ("error" in dates) {
            Toast("error", "Erro ao atualizar as datas indisponíveis.");
          } else {
            Toast("success", "Datas indisponíveis atualizadas com sucesso.");
          }
          refetch().then(() => {
            push("/config/interviews");
          });
        });
      });
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setDefaultInterview({
        ...data.data,
        type: {
          id: data.data.type,
          name: convertInterviewType[
            data.data.type as keyof typeof convertInterviewType
          ],
        },
      });
    }
  }, [isSuccess, isFetching]);

  if (!defaultInterview) return <div>Agendamento não encontrado</div>;

  return (
    <ConfigInterviewForm
      handleOnSubmit={handleUpdateInterview}
      defaultValue={defaultInterview}
    />
  );
}
