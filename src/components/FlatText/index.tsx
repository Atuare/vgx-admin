import styles from "./FlatText.module.scss";

interface FlatTextProps {
  text: string;
  type: string;
}

export default function FlatText({ text, type }: FlatTextProps) {
  const bgColor = {
    CONCLUIDO: "var(--sucess)",
    EM_ANDAMENTO: "var(--attention)",
    EMANDAMENTO: "var(--attention)",
    CANCELADO: "var(--error)",
    SUSPENSO: "var(--secondary-7)",
  };

  return (
    <div
      className={styles.flatText}
      style={{ color: bgColor[type as keyof typeof bgColor] }}
    >
      <span>{text}</span>
    </div>
  );
}
