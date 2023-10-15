import * as Accordion from "@radix-ui/react-accordion";
import { Assessment } from "./Assessment";
import styles from "./TrainingCreate.module.scss";

interface TrainingCreateAssessmentsProps {
  trainingDays: number;
}

export function TrainingCreateAssessments({
  trainingDays,
}: TrainingCreateAssessmentsProps) {
  return (
    <section className={styles.assessments}>
      <h1>Avaliação</h1>
      {trainingDays ? (
        <Accordion.Root className={styles.accordion} type="single" collapsible>
          {Array.from({ length: trainingDays }).map((_, index) => (
            <Assessment questionNumber={index + 1} key={crypto.randomUUID()} />
          ))}
        </Accordion.Root>
      ) : null}
    </section>
  );
}
