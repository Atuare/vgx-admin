"use client";
import AdmissionForm from "@/components/Admission/Form";
import useUser from "@/hooks/useUser";
import { useCreateAdmissionMutation } from "@/services/api/fetchApi";
import { Toast } from "@/utils/toast";
import { useRouter } from "next/navigation";

const defaultTableSize = 5;

export default function AdmissionCreate() {
  const { user } = useUser();
  const { push } = useRouter();

  const [createAdmission] = useCreateAdmissionMutation();

  const handleCreateAdmission = (data: any) => {
    createAdmission({ examiner: user?.employee?.name, ...data }).then(() => {
      Toast("success", "Admissão criada com sucesso!");
      push("/admissions");
    });
  };

  return (
    <AdmissionForm
      defaultTableSize={defaultTableSize}
      handleOnSubmit={handleCreateAdmission}
    />
  );
}
