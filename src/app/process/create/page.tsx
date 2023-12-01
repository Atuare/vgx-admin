"use client";
import { StepOneProcessCreate } from "@/components/ProcessCreate/StepOneProcessCreate";
import { StepThreeProcessCreate } from "@/components/ProcessCreate/StepThreeProcessCreate";
import { StepTwoProcessCreate } from "@/components/ProcessCreate/StepTwoProcessCreate";
import { Stepper } from "@/components/Stepper";
import { useState } from "react";
import styles from "./ProcessCreate.module.scss";

export default function ProcessCreate() {
  const [step, setStep] = useState(1);
  const [processData, setProcessData] = useState({} as any);

  const handleSetProcessData = (data: any) => {
    setProcessData(data);
  };

  const handleTogglePage = (page: number) => {
    setStep(page);
  };

  return (
    <div className={styles.process}>
      <Stepper step={step} />
      {step === 1 && (
        <StepOneProcessCreate
          handleTogglePage={handleTogglePage}
          currentProcessData={processData}
          setProcessData={handleSetProcessData}
        />
      )}
      {step === 2 && (
        <StepTwoProcessCreate
          handleTogglePage={handleTogglePage}
          currentProcessData={processData}
          setProcessData={handleSetProcessData}
          setStep={setStep}
        />
      )}
      {step === 3 && (
        <StepThreeProcessCreate processData={processData} setStep={setStep} />
      )}
    </div>
  );
}
