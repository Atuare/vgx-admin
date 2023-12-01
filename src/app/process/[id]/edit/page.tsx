"use client";
import { StepOneProcessEdit } from "@/components/ProcessEdit/StepOneProcessEdit";
import { StepThreeProcessEdit } from "@/components/ProcessEdit/StepThreeProcessEdit";
import { StepTwoProcessEdit } from "@/components/ProcessEdit/StepTwoProcessEdit";
import { Stepper } from "@/components/Stepper";
import { useGetProcessCandidatesQuery } from "@/services/api/fetchApi";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./ProcessEdit.module.scss";

export default function ProcessEdit() {
  const [step, setStep] = useState(1);
  const [processData, setProcessData] = useState<any>();

  const pathname = usePathname();
  const processID = pathname.split("/")[2];

  const { data, isSuccess } = useGetProcessCandidatesQuery({
    id: processID,
  });

  const handleSetProcessData = (data: any) => {
    setProcessData(data);
  };

  const handleTogglePage = (page: number) => {
    setStep(page);
  };

  useEffect(() => {
    isSuccess && setProcessData(data.data);
  }, [isSuccess]);

  if (!processData) return <div>Processo não encontrado.</div>;

  return (
    <div className={styles.process}>
      <Stepper step={step} />
      {step === 1 && (
        <StepOneProcessEdit
          handleTogglePage={handleTogglePage}
          currentProcessData={processData}
          setProcessData={handleSetProcessData}
        />
      )}
      {step === 2 && (
        <StepTwoProcessEdit
          handleTogglePage={handleTogglePage}
          currentProcessData={processData}
          setProcessData={handleSetProcessData}
          setStep={setStep}
        />
      )}
      {step === 3 && (
        <StepThreeProcessEdit processData={processData} setStep={setStep} />
      )}
    </div>
  );
}
