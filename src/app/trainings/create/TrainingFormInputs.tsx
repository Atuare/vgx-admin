"use client";
import { DataInput } from "@/components/DataInput";
import { NumberInput } from "@/components/NumberInput";
import { Select } from "@/components/Select";
import useUser from "@/hooks/useUser";
import { ITrainingCreateForm } from "@/interfaces/training.interface";
import { trainingTypesOptions } from "@/utils/training";
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

export function TrainingFormInputs({
  handleChangeAssessmentsFields,
  control,
  errors,
  register,
}: TrainingFormInputsProps) {
  const { user } = useUser();

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
                  if (!val && typeof value === "undefined") return;
                  handleChangeAssessmentsFields(
                    value > val ? "REMOVE" : "APPEND",
                  );
                  onChange(val);
                }}
              />
            </DataInput>
          )}
        />

        <Controller
          name="participantLimit"
          control={control}
          render={({ field: { onChange } }) => (
            <DataInput
              name="Lim. participantes"
              required
              width="173px"
              error={errors?.participantLimit?.message}
            >
              <NumberInput width={120} onChange={onChange} />
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

        <DataInput
          name="Data inicial"
          required
          width="184px"
          error={errors?.startDate?.message}
        >
          <input type="date" {...register("startDate")} />
        </DataInput>

        <DataInput
          name="Data final"
          required
          width="184px"
          error={errors?.endDate?.message}
        >
          <input type="date" {...register("endDate")} />
        </DataInput>

        <DataInput
          name="Local"
          required
          width="336px"
          error={errors?.trainingLocation?.message}
        >
          <input type="text" {...register("trainingLocation")} />
        </DataInput>

        <Controller
          name="trainingType"
          control={control}
          render={({ field: { onChange } }) => (
            <DataInput
              name="Tipo treinamento"
              required
              width="336px"
              error={errors?.trainingType?.message}
            >
              <Select
                options={trainingTypesOptions}
                placeholder="Selecione"
                onChange={({ id }) => onChange(id)}
              />
            </DataInput>
          )}
        />
      </ul>
    </section>
  );
}
