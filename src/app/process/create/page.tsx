"use client";
import { StepOne } from "@/components/ProcessCreate/StepOne";
import StepThree from "@/components/ProcessCreate/StepThree";
import { StepTwo } from "@/components/ProcessCreate/StepTwo";
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
        <StepOne
          handleTogglePage={handleTogglePage}
          setProcessData={handleSetProcessData}
        />
      )}
      {step === 2 && (
        <StepTwo
          handleTogglePage={handleTogglePage}
          currentProcessData={processData}
          setProcessData={handleSetProcessData}
        />
      )}
      {step === 3 && <StepThree processData={processData} />}
    </div>
  );
}
