"use client";
import { TrainingCreateForm } from "@/components/Training/Form";
import { ITrainingCreateForm } from "@/interfaces/training.interface";
import { useCreateTrainingMutation } from "@/services/api/fetchApi";
import { Toast } from "@/utils/toast";
import { useRouter } from "next/navigation";

export default function TrainingCreate() {
  const { push } = useRouter();
  const [createTraining] = useCreateTrainingMutation();

  const handleOnSubmit = (data: ITrainingCreateForm) => {
    createTraining({
      status: "EM_ANDAMENTO",
      ...data,
    }).then(data => {
      if ("error" in data) {
        Toast("error", "Erro ao criar o treinamento");
      } else {
        Toast("success", "Treinamento criado com sucesso");
        push("/trainings");
      }
    });
  };

  return <TrainingCreateForm onSubmit={handleOnSubmit} />;
}
