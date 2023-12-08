"use client";
import { TrainingCreateForm } from "@/components/Training/Form";
import {
  useGetTrainingByIdQuery,
  useUpdateTrainingMutation,
} from "@/services/api/fetchApi";
import { Toast } from "@/utils/toast";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TrainingEdit() {
  const [training, setTraining] = useState();

  const { push } = useRouter();
  const params = useParams();

  const [updateTraining] = useUpdateTrainingMutation();

  const { data, isSuccess, refetch, isFetching } = useGetTrainingByIdQuery({
    id: Array.from(params.id).join(""),
  });

  const handleOnSubmit = (data: any) => {
    updateTraining({
      ...data,
    }).then(data => {
      if ("error" in data) {
        Toast("error", "Erro ao atualizar o treinamento");
      } else {
        refetch().then(() => push("/trainings"));
        Toast("success", "Treinamento atualizado com sucesso");
      }
    });
  };

  useEffect(() => {
    isSuccess && setTraining(data.data);
  }, [isSuccess, isFetching]);

  if (!training)
    return <div style={{ margin: "0 auto" }}>Treinamento não encontrado.</div>;

  return (
    <TrainingCreateForm onSubmit={handleOnSubmit} defaultValue={training} />
  );
}
