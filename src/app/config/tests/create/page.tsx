"use client";

import TestForm from "@/components/Tests/Form";
import { useCreateTestMutation } from "@/services/api/fetchApi";
import { Toast } from "@/utils/toast";
import { useRouter } from "next/navigation";

export default function TestCreate() {
  const { push } = useRouter();

  const [createTest] = useCreateTestMutation();

  const handleCreateTest = (data: any) => {
    createTest(data)
      .then(() => {
        Toast("success", "Prova criada com sucesso!");
        push("/config/tests");
      })
      .catch(() => {
        Toast("error", "Não foi possível criar a prova.");
      });
  };

  return <TestForm handleOnSubmit={handleCreateTest} />;
}
