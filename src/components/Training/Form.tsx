import useUser from "@/hooks/useUser";
import {
  ITrainingCreateForm,
  ITrainingCreateFormDefaultValue,
} from "@/interfaces/training.interface";
import { trainingCreateSchema } from "@/schemas/trainingSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "../Button";
import styles from "./TrainingCreate.module.scss";
import { TrainingCreateAssessments } from "./TrainingCreateAssessments";
import { TrainingFormInputs } from "./TrainingFormInputs";

interface IFormProps {
  defaultValue?: ITrainingCreateFormDefaultValue;
  onSubmit: (data: ITrainingCreateForm) => void;
}

export function TrainingCreateForm({ defaultValue, onSubmit }: IFormProps) {
  const { user } = useUser();

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
    trigger,
    watch,
  } = useForm<ITrainingCreateForm>({
    resolver: yupResolver(trainingCreateSchema),
  });

  const { fields, append, remove, replace } = useFieldArray({
    name: "trainingAssessments",
    control,
  });

  const handleChangeAssessmentsFields = (
    type: "APPEND" | "REMOVE" | "REMOVE_ALL" | "NONE",
  ) => {
    if (type === "REMOVE" && fields.length === 0) return;

    switch (type) {
      case "APPEND":
        append({
          maxTimeToFinish: 0,
          minimumPassingGrade: 0,
          questionsAmount: 0,
          approvedMessage: "",
          disapprovedMessage: "",
          orientationMessage: "",
          trainingAssessmentQuestions: [],
        });
        break;
      case "REMOVE":
        remove(fields.length - 1);
        break;
      case "REMOVE_ALL":
        replace([]);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (watch("startDate") && watch("endDate")) {
      trigger("endDate");
      trigger("startDate");
    }
  }, [watch("endDate"), watch("startDate")]);

  useEffect(() => {
    if (!defaultValue) {
      reset({
        trainer: user?.employee?.name,
        trainingDays: 0,
      });
    }
  }, [user]);

  useEffect(() => {
    if (defaultValue) {
      reset({
        ...defaultValue,
        trainingTypeId: defaultValue.trainingType.id,
        assessmentsAmount: defaultValue.trainingAssessments.length ?? 0,
      });
    }
  }, [defaultValue]);

  return (
    <main className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <TrainingFormInputs
          handleChangeAssessmentsFields={handleChangeAssessmentsFields}
          register={register}
          control={control}
          errors={errors}
        />
        <TrainingCreateAssessments
          fields={fields}
          register={register}
          control={control}
          errors={errors}
          trigger={trigger}
        />
        <footer className={styles.form__footer}>
          <Button buttonType="default" text="Cancelar" type="button" />
          <Button buttonType="primary" text="Salvar" type="submit" />
        </footer>
      </form>
    </main>
  );
}
