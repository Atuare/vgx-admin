import styles from "./Stepper.module.scss";

const steps = [
  "Dados do processo",
  "Disponibilidade e Escolaridade",
  "Confirmação de dados",
];

export function Stepper({ step }: { step: number }) {
  return (
    <div className={styles.stepper}>
      {steps.map((item, index) => (
        <>
          {index !== 0 && (
            <div
              className={`${styles.stepper__line} ${
                step >= index + 1 ? styles.active : ""
              }`}
            />
          )}
          <div
            className={`${styles.stepper__content} ${
              step >= index + 1 ? styles.active : ""
            }`}
          >
            <div className={styles.stepper__content__index}>{index + 1}</div>
            <p>{item}</p>
          </div>
        </>
      ))}
    </div>
  );
}
