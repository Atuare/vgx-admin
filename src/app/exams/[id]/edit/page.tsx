"use client";

import { Button } from "@/components/Button";
import { DataInput } from "@/components/DataInput";
import { NumberInput } from "@/components/NumberInput";
import { IExam } from "@/interfaces/exams.interface";
import { examsEditSchema } from "@/schemas/examsShema";
import {
  useGetExamByIdQuery,
  useUpdateExamMutation,
} from "@/services/api/fetchApi";
import { formattedTimeToISOString } from "@/utils/formatTimeRange";
import { Toast } from "@/utils/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import styles from "./ExamsEdit.module.scss";

export default function ExamsEdit() {
  const pathname = usePathname();
  const { push } = useRouter();

  const examId = pathname.split("/")[2];

  const [examData, setExamData] = useState<any>();
  const { data, isFetching, isSuccess } = useGetExamByIdQuery({
    id: examId,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(examsEditSchema),
    defaultValues: { ...examData },
  });

  const [updateExam] = useUpdateExamMutation();

  const handleEditExam = (data: IExam) => {
    const examTime = dayjs(data?.time).isValid()
      ? data?.time
      : formattedTimeToISOString(data?.time);

    updateExam({
      examId: data.id,
      data: {
        status: examData?.status,
        examiner: data?.examiner,
        startDate: dayjs(data.startDate).toISOString(),
        endDate: dayjs(data.endDate).toISOString(),
        candidateLimit: data?.candidateLimit,
        location: data?.location,
        time: examTime,
      },
    });
    Toast("success", "Exame atualizado com sucesso!");
    location.replace(`/exams/${examId}`);
  };

  useEffect(() => {
    isSuccess && setExamData(data?.data);
  }, [isSuccess, isFetching]);

  useEffect(() => {
    if (examData) {
      reset({
        id: examData?.id,
        examiner: examData?.examiner,
        startDate: examData?.startDate,
        endDate: examData?.endDate,
        candidateLimit: examData?.candidateLimit,
        location: examData?.location,
        time: dayjs(examData?.time).format("HH:mm"),
      });
    }
  }, [examData]);

  if (!examData) return;

  return (
    <main className={styles.exams}>
      <h1 className={styles.exams__title}>Dados Exame</h1>

      <form onSubmit={handleSubmit(handleEditExam)}>
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
                <NumberInput
                  defaultValue={examData.candidateLimit}
                  onChange={onChange}
                />
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
