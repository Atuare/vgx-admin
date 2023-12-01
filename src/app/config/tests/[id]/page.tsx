"use client";

import TestForm from "@/components/Tests/Form";
import {
  useGetTestByIdQuery,
  useUpdateTestMutation,
} from "@/services/api/fetchApi";
import { Toast } from "@/utils/toast";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TestEdit() {
  const [test, setTest] = useState();
  const params = useParams();
  const { replace } = useRouter();

  const [updateTest] = useUpdateTestMutation();
  const { data, isSuccess, isFetching } = useGetTestByIdQuery({
    id: Array.from(params.id).join(""),
  });

  const handleEditTest = (data: any) => {
    const { unit, ...rest } = data;
    updateTest(rest)
      .then(() => {
        Toast("success", "Prova editada com sucesso!");
        location.replace("/config/tests");
      })
      .catch(() => {
        Toast("error", "Não foi possível editar a prova.");
      });
  };

  useEffect(() => {
    isSuccess && setTest(data.data);
  }, [isSuccess, isFetching]);

  if (!test) return;

  return <TestForm handleOnSubmit={handleEditTest} defaultValue={test} />;
}
