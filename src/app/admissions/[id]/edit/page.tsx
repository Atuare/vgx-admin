"use client";
import AdmissionForm from "@/components/Admission/Form";
import { IAdmissionResult } from "@/interfaces/admissions.interface";
import {
  useGetAdmissionQuery,
  useUpdateAdmissionMutation,
} from "@/services/api/fetchApi";
import { Toast } from "@/utils/toast";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const defaultTableSize = 5;

export default function AdmissionEdit() {
  const [admission, setAdmission] = useState<IAdmissionResult>();
  const params = useParams();

  const { data, isSuccess } = useGetAdmissionQuery({
    admissionId: Array.from(params.id).join(""),
    page: 1,
    size: defaultTableSize,
  });

  const [updateAdmission] = useUpdateAdmissionMutation();

  const handleUpdateAdmission = (data: any) => {
    updateAdmission({
      id: Array.from(params.id).join(""),
      examiner: admission?.admission.examiner,
      date: dayjs(data.date).toISOString(),
      ...data,
    }).then(data => {
      if ("error" in data) {
        Toast("error", "Erro ao atualizar admissão!");
      } else {
        Toast("success", "Admissão atualizada com sucesso!");
        location.replace("/admissions");
      }
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setAdmission(data);
    }
  }, [isSuccess]);

  return (
    <AdmissionForm
      defaultTableSize={defaultTableSize}
      handleOnSubmit={handleUpdateAdmission}
      defaultValue={admission}
    />
  );
}
