import { ITrainingCreateForm } from "@/interfaces/training.interface";
import * as Accordion from "@radix-ui/react-accordion";
import { Fragment } from "react";
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { Assessment } from "./Assessment";
import styles from "./TrainingCreate.module.scss";

interface TrainingCreateAssessmentsProps {
  register: UseFormRegister<ITrainingCreateForm>;
  control: Control<ITrainingCreateForm>;
  errors: FieldErrors<ITrainingCreateForm>;
  fields: FieldArrayWithId<ITrainingCreateForm, "trainingAssessments", "id">[];
}

export function TrainingCreateAssessments({
  fields,
  control,
  errors,
  register,
}: TrainingCreateAssessmentsProps) {
  return (
    <section className={styles.assessments}>
      <h1>Avaliação</h1>
      {fields ? (
        <Accordion.Root className={styles.accordion} type="single" collapsible>
          {fields.map((field, index) => {
            return (
              <Fragment key={field.id}>
                <Assessment
                  questionNumber={index + 1}
                  field={field}
                  control={control}
                  errors={errors}
                  register={register}
                  index={index}
                />
                {errors.trainingAssessments?.[index] && (
                  <p className={styles.error}>Preenchimento obrigatorio</p>
                )}
              </Fragment>
            );
          })}
        </Accordion.Root>
      ) : null}
      {errors.trainingAssessments?.message && (
        <span className="error-message">
          {errors.trainingAssessments.message}
        </span>
      )}
    </section>
  );
}
