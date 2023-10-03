"use client";
import { StepOneProcessEdit } from "@/components/ProcessEdit/StepOneProcessEdit";
import { StepThreeProcessEdit } from "@/components/ProcessEdit/StepThreeProcessEdit";
import { StepTwoProcessEdit } from "@/components/ProcessEdit/StepTwoProcessEdit";
import { Stepper } from "@/components/Stepper";
import { useProcessEdit } from "@/hooks/useProcess";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./ProcessEdit.module.scss";

export default function ProcessEdit() {
  const [step, setStep] = useState(1);
  const pathname = usePathname();
  const { push } = useRouter();
  const { processEdit } = useProcessEdit();
  const [processData, setProcessData] = useState<any>(processEdit);

  const handleSetProcessData = (data: any) => {
    setProcessData(data);
  };

  const handleTogglePage = (page: number) => {
    setStep(page);
  };

  if (!processData) return;

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
