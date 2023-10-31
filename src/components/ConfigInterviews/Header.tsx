import styles from "./ConfigInterview.module.scss";

const steps = [
  "GERAL",
  "HORÁRIOS E LIMITES DE AGENDAMENTO",
  "DATAS INDISPONÍVEIS",
];

interface IInterviewHeader {
  step: number;
}

export function InterviewHeader({ step }: IInterviewHeader) {
  return (
    <header className={styles.header}>
      {steps.map((item, index) => (
        <button
          key={crypto.randomUUID()}
          className={`${step === index + 1 ? styles.active : ""}`}
        >
          <p>{item}</p>
        </button>
      ))}
    </header>
  );
}
