"use client";
import { useState } from "react";
import { Stepper } from "@/components/Stepper";
import styles from "./ProcessCreate.module.scss";
import { StepOne } from "@/components/ProcessCreate/StepOne";

export default function ProcessCreate() {
  const [step, setStep] = useState(1);

  return (
    <div className={styles.process}>
      <Stepper step={step} />
      {step === 1 && <StepOne />}
    </div>
  );
}
