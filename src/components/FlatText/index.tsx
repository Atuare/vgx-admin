import styles from "./FlatText.module.scss";

interface FlatTextProps {
  text: string;
  type: string;
}

export default function FlatText({ text, type }: FlatTextProps) {
  const bgColor = {
    CONCLUIDO: "var(--sucess)",
    ASSINADO: "var(--sucess)",
    EM_ANDAMENTO: "var(--attention)",
    EMANDAMENTO: "var(--attention)",
    "EM ANDAMENTO": "var(--attention)",
    PENDENTE: "var(--attention)",
    CANCELADO: "var(--error)",
    "NÃO ASSINADO": "var(--error)",
    NÃOASSINADO: "var(--error)",
    SUSPENSO: "var(--secondary-7)",
  };

  return (
    <div
      className={styles.flatText}
      style={{ background: bgColor[type as keyof typeof bgColor] }}
    >
      <span>{text}</span>
    </div>
  );
}
