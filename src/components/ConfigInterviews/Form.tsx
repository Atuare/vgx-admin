"use client";
import { Dates } from "@/components/ConfigInterviews/Dates";
import { General } from "@/components/ConfigInterviews/General";
import { InterviewHeader } from "@/components/ConfigInterviews/Header";
import { Schedulings } from "@/components/ConfigInterviews/Schedulings";
import { ICreateInterview } from "@/interfaces/configInterviews.interface";
import { useState } from "react";
import styles from "./InterviewCreate.module.scss";

interface IConfigInterviewFormProps {
  handleOnSubmit: (data: any) => void;
  defaultValue?: ICreateInterview;
}

export function ConfigInterviewForm({
  handleOnSubmit,
  defaultValue,
}: IConfigInterviewFormProps) {
  const [interview, setInterview] = useState<ICreateInterview | undefined>(
    defaultValue,
  );
  const [step, setStep] = useState<number>(1);

  const handleChangeStep = (data: any) => {
    setInterview({
      ...interview,
      ...data,
    });

    step < 3 && setStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    step > 1 && setStep(prev => prev - 1);
  };

  const handleCreateInterview = (data: any) => {
    setInterview({
      ...interview,
      ...data,
    });

    handleOnSubmit({
      status: true,
      ...interview,
      ...data,
      unitOrSite: interview?.unitOrSite.id,
      type: interview?.type.id,
    });
  };

  return (
    <main className={styles.container}>
      <InterviewHeader step={step} />
      {step === 1 ? (
        <General handleOnSubmit={handleChangeStep} interview={interview} />
      ) : step === 2 ? (
        <Schedulings
          defaultSchedulings={interview?.schedulings}
          handleOnSubmit={handleChangeStep}
          handleBackStep={handleBackStep}
        />
      ) : step === 3 ? (
        <Dates
          defaultDates={interview?.dates}
          handleOnSubmit={handleCreateInterview}
          handleBackStep={handleBackStep}
        />
      ) : (
        <div>Ocorreu um erro, atualize a página.</div>
      )}
    </main>
  );
}
