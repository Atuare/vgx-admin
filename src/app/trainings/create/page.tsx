"use client";
import { Button } from "@/components/Button";
import useUser from "@/hooks/useUser";
import { ITrainingCreateForm } from "@/interfaces/training.interface";
import { trainingCreateSchema } from "@/schemas/trainingSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./TrainingCreate.module.scss";
import { TrainingCreateAssessments } from "./TrainingCreateAssessments";
import { TrainingFormInputs } from "./TrainingFormInputs";

export default function TrainingCreate() {
  const [trainingDays, setTrainingDays] = useState(0);
  const { user } = useUser();

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ITrainingCreateForm>({
    resolver: yupResolver(trainingCreateSchema),
    defaultValues: {
      trainer: user?.employee?.name,
    },
  });

  const handleOnSubmit = (data: any) => {};

  return (
    <main className={styles.container}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className={styles.form}>
        <TrainingFormInputs
          handleOnChangeTrainingDays={setTrainingDays}
          register={register}
          control={control}
          errors={errors}
        />
        <TrainingCreateAssessments trainingDays={trainingDays} />
        <footer className={styles.form__footer}>
          <Button buttonType="default" text="Cancelar" type="button" />
          <Button buttonType="primary" text="Salvar" type="submit" />
        </footer>
      </form>
    </main>
  );
}
