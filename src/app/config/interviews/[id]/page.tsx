"use client";
import { ConfigInterviewForm } from "@/components/ConfigInterviews/Form";
import { ICreateInterview } from "@/interfaces/configInterviews.interface";
import {
  useGetInterviewSettingsByIdQuery,
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

  const { push } = useRouter();
  const params = useParams();

  const { data, isSuccess, refetch } = useGetInterviewSettingsByIdQuery({
    id: Array.from(params.id).join(""),
  });

  const handleCreateInterview = (data: any) => {
    updateInterview(data).then(data => {
      if ("error" in data) {
        Toast("error", "Erro ao editar o agendamento.");
      } else {
        Toast("success", "Agendamento atualizado com sucesso.");
        push("/config/interviews");
      }
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
  }, [isSuccess]);

  useEffect(() => {
    refetch();
  }, []);

  if (!defaultInterview) return <div>Agendamento não encontrado</div>;

  return (
    <ConfigInterviewForm
      handleOnSubmit={handleCreateInterview}
      defaultValue={defaultInterview}
    />
  );
}
