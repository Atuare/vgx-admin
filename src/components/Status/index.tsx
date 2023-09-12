import { DonutLarge } from "@/assets/Icons";
import styles from "./Status.module.scss";

enum StatusEnum {
  "EMANDAMENTO" = "EM ANDAMENTO",
  SUSPENSO = "SUSPENSO",
  CONCLUÍDO = "CONCLUÍDO",
  CANCELADO = "CANCELADO",
}

export function Status({ type }: { type: string }) {
  const bgColor = {
    CONCLUIDO: "var(--sucess)",
    EM_ANDAMENTO: "var(--attention)",
    EMANDAMENTO: "var(--attention)",
    "EM ANDAMENTO": "var(--attention)",
    CANCELADO: "var(--error)",
    SUSPENSO: "var(--secondary-7)",
  };

  const status = StatusEnum[type as keyof typeof StatusEnum];

  return (
    <div
      className={styles.status}
      style={{ background: bgColor[type as keyof typeof bgColor] }}
    >
      {status}
      <DonutLarge />
    </div>
  );
}
