"use client";

import TestForm from "@/components/Tests/Form";
import { useUpdateTestMutation } from "@/services/api/fetchApi";
import { Toast } from "@/utils/toast";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TestEdit() {
  const [test, setTest] = useState();
  const pathname = usePathname();
  const { push } = useRouter();

  const [updateTest] = useUpdateTestMutation();

  const getTestData = () => {
    const testId = pathname.split("/")[3];
  };

  const handleEditTest = (data: any) => {
    updateTest(data)
      .then(() => {
        Toast("success", "Prova editada com sucesso!");
        push("/config/tests");
      })
      .catch(() => {
        Toast("error", "Não foi possível editar a prova.");
      });
  };

  useEffect(() => {
    getTestData();
  }, []);

  return <TestForm handleOnSubmit={handleEditTest} />;
}
