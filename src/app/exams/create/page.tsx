"use client";

import { Button } from "@/components/Button";
import { DataInput } from "@/components/DataInput";
import { NumberInput } from "@/components/NumberInput";
import { examsCreateSchema } from "@/schemas/examsShema";
import { useCreateExamMutation } from "@/services/api/fetchApi";
import { formattedTimeToISOString } from "@/utils/formatTimeRange";
import { Toast } from "@/utils/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
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

  const [createExam] = useCreateExamMutation();

  const handleCreateExam = (data: any) => {
    createExam({
      data: {
        status: "INCOMING",
        examiner: data?.examiner,
        startDate: dayjs(data.startDate).toISOString(),
        endDate: dayjs(data.endDate).toISOString(),
        candidateLimit: data?.candidateLimit,
        location: data?.location,
        time: formattedTimeToISOString(data?.time),
      },
    });
    Toast("success", "Exame criado com sucesso!");
    location.replace("/exams");
  };

  return (
    <main className={styles.exams}>
      <h1 className={styles.exams__title}>Dados Exame</h1>

      <form onSubmit={handleSubmit(handleCreateExam)}>
        <section className={styles.exams__inputs}>
          <DataInput
            name="Examinador"
            required
            width="336px"
            error={errors.examiner?.message?.toString()}
          >
            <input type="text" {...register("examiner")} />
          </DataInput>

          <Controller
            control={control}
            name="startDate"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DataInput
                name="Data inicial"
                required
                width="184px"
                error={error?.message}
              >
                <input
                  type="date"
                  value={value ? dayjs(value).format("YYYY-MM-DD") : ""}
                  onChange={onChange}
                />
              </DataInput>
            )}
          />

          <Controller
            control={control}
            name="endDate"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DataInput
                name="Data final"
                required
                width="184px"
                error={error?.message}
              >
                <input
                  type="date"
                  value={value ? dayjs(value).format("YYYY-MM-DD") : ""}
                  onChange={onChange}
                />
              </DataInput>
            )}
          />

          <Controller
            control={control}
            name="candidateLimit"
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
            error={errors.location?.message?.toString()}
          >
            <input type="text" {...register("location")} />
          </DataInput>

          <Controller
            control={control}
            name="time"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DataInput
                name="Horário"
                required
                width="184px"
                error={error?.message}
              >
                <input type="time" value={value || ""} onChange={onChange} />
              </DataInput>
            )}
          />
        </section>

        <footer className={styles.exams__footer}>
          <Button buttonType="default" text="Cancelar" type="button" />
          <Button buttonType="primary" text="Salvar" type="submit" />
        </footer>
      </form>
      <ToastContainer />
    </main>
  );
}
