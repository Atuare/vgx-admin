"use client";
import { DataInput } from "@/components/DataInput";
import { NumberInput } from "@/components/NumberInput";
import { Select } from "@/components/Select";
import useUser from "@/hooks/useUser";
import { ITrainingCreateForm } from "@/interfaces/training.interface";
import { useGetAllTrainingTypesQuery } from "@/services/api/fetchApi";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import styles from "./TrainingCreate.module.scss";

interface TrainingFormInputsProps {
  handleChangeAssessmentsFields: (type: "APPEND" | "REMOVE") => void;
  register: UseFormRegister<ITrainingCreateForm>;
  control: Control<ITrainingCreateForm>;
  errors: FieldErrors<ITrainingCreateForm>;
}

type TSelectOptions = {
  id: string;
  name: string;
};

export function TrainingFormInputs({
  handleChangeAssessmentsFields,
  control,
  errors,
  register,
}: TrainingFormInputsProps) {
  const { user } = useUser();
  const [trainingTypesOptions, setTrainingTypesOptions] = useState<
    TSelectOptions[]
  >([]);

  const { data, isSuccess } = useGetAllTrainingTypesQuery({
    page: 1,
    size: 9999,
  });

  useEffect(() => {
    if (isSuccess) {
      setTrainingTypesOptions(
        data.trainingTypes.map((item: any) => ({
          id: item.id,
          name: item.trainingTypeName,
        })),
      );
    }
  }, [isSuccess]);

  return (
    <section className={styles.form__data}>
      <h1>Dados treinamento</h1>
      <ul className={styles.form__data__inputs}>
        <DataInput
          name="Nome treinamento"
          required
          width="336px"
          error={errors?.trainingName?.message}
        >
          <input type="text" {...register("trainingName")} />
        </DataInput>

        <DataInput name="Nome produto" lightName="(opcional)" width="336px">
          <input type="text" {...register("productName")} />
        </DataInput>

        <DataInput
          name="Instrutor"
          required
          width="336px"
          error={errors?.trainer?.message}
        >
          <input
            type="text"
            defaultValue={user?.employee?.name}
            disabled
            {...register("trainer")}
          />
        </DataInput>

        <Controller
          name="trainingDays"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DataInput
              name="Dias de treinamento"
              required
              width="188px"
              error={errors?.trainingDays?.message}
            >
              <NumberInput
                width={120}
                onChange={val => {
                  if (typeof value !== "undefined" && val !== value) {
                    handleChangeAssessmentsFields(
                      value > val ? "REMOVE" : "APPEND",
                    );
                    onChange(val);
                  }
                }}
                defaultValue={value}
              />
            </DataInput>
          )}
        />

        <Controller
          name="participantLimit"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DataInput
              name="Lim. participantes"
              required
              width="173px"
              error={errors?.participantLimit?.message}
            >
              <NumberInput
                width={120}
                onChange={onChange}
                defaultValue={value}
              />
            </DataInput>
          )}
        />

        <DataInput
          name="Frequência mín."
          required
          width="150px"
          error={errors?.minimumFrequency?.message}
        >
          <div className={styles.minimumFrequencyInput}>
            <input
              type="number"
              {...register("minimumFrequency")}
              maxLength={3}
              max={100}
            />
            <span>%</span>
          </div>
        </DataInput>

        <Controller
          control={control}
          name="startDate"
          render={({ field: { onChange, value } }) => (
            <DataInput
              name="Data inicial"
              required
              width="184px"
              error={errors?.startDate?.message}
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
          render={({ field: { onChange, value } }) => (
            <DataInput
              name="Data final"
              required
              width="184px"
              error={errors?.endDate?.message}
            >
              <input
                type="date"
                value={value ? dayjs(value).format("YYYY-MM-DD") : ""}
                onChange={onChange}
              />
            </DataInput>
          )}
        />

        <DataInput
          name="Local"
          required
          width="336px"
          error={errors?.trainingLocation?.message}
        >
          <input type="text" {...register("trainingLocation")} />
        </DataInput>

        <Controller
          name="trainingTypeId"
          control={control}
          render={({ field: { onChange, value } }) => (
            <DataInput
              name="Tipo treinamento"
              required
              width="336px"
              error={errors?.trainingTypeId?.message}
            >
              <Select
                options={trainingTypesOptions}
                placeholder="Selecione"
                onChange={({ id }) => onChange(id)}
                defaultValue={
                  trainingTypesOptions
                    ? trainingTypesOptions.find(item => item.id === value)?.name
                    : undefined
                }
              />
            </DataInput>
          )}
        />
      </ul>
    </section>
  );
}
