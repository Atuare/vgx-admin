"use client";

import { Button } from "@/components/Button";
import { DataInput } from "@/components/DataInput";
import { NumberInput } from "@/components/NumberInput";
import { examsCreateSchema } from "@/schemas/examsShema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import styles from "./ExamsCreate.module.scss";

export default function ExamsCreate() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(examsCreateSchema),
  });

  const handleCreateExam = () => {};

  return (
    <main className={styles.exams}>
      <h1 className={styles.exams__title}>Dados Exame</h1>

      <form onSubmit={handleSubmit(handleCreateExam)}>
        <section className={styles.exams__inputs}>
          <DataInput
            name="Examinador"
            required
            width="336px"
            error={errors.examiner?.message}
          >
            <input type="text" {...register("examiner")} />
          </DataInput>

          <DataInput
            name="Data inicial"
            required
            width="184px"
            error={errors.startDate?.message}
          >
            <input type="date" {...register("startDate")} />
          </DataInput>

          <DataInput
            name="Data final"
            required
            width="184px"
            error={errors.endDate?.message}
          >
            <input type="date" {...register("endDate")} />
          </DataInput>

          <Controller
            control={control}
            name="limit"
            render={({ field: { onChange }, fieldState: { error } }) => (
              <DataInput
                name="Lim. participantes"
                required
                width="173px"
                error={error?.message}
              >
                <NumberInput onChange={onChange} />
              </DataInput>
            )}
          />

          <DataInput
            name="Local"
            required
            width="336px"
            error={errors.local?.message}
          >
            <input type="text" {...register("local")} />
          </DataInput>

          <DataInput
            name="Horário"
            required
            width="184px"
            error={errors.hour?.message}
          >
            <input type="time" {...register("hour")} />
          </DataInput>
        </section>

        <footer className={styles.exams__footer}>
          <Button buttonType="default" text="Cancelar" type="button" />
          <Button buttonType="primary" text="Salvar" type="submit" />
        </footer>
      </form>
    </main>
  );
}
