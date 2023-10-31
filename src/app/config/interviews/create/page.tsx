"use client";
import { ConfigInterviewForm } from "@/components/ConfigInterviews/Form";
import { useCreateInterviewSettingMutation } from "@/services/api/fetchApi";
import { Toast } from "@/utils/toast";
import { useRouter } from "next/navigation";

export default function InterviewsCreatePage() {
  const [createInterview] = useCreateInterviewSettingMutation();

  const { push } = useRouter();

  const handleCreateInterview = (data: any) => {
    createInterview(data).then(data => {
      if ("error" in data) {
        Toast("error", "Erro ao criar um novo agendamento.");
      } else {
        Toast("success", "Agendamento criado com sucesso.");
        push("/config/interviews");
      }
    });
  };

  return <ConfigInterviewForm handleOnSubmit={handleCreateInterview} />;
}
