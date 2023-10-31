import { DonutLarge } from "@/assets/Icons";
import { ExamsStatusEnum } from "@/enums/status.enum";
import styles from "./Status.module.scss";

enum StatusEnum {
  "EMANDAMENTO" = "EM ANDAMENTO",
  SUSPENSO = "SUSPENSO",
  CONCLUÍDO = "CONCLUÍDO",
  CANCELADO = "CANCELADO",
}

export function Status({
  type,
  pointer = false,
}: {
  type: string;
  pointer?: boolean;
}) {
  const bgColor = {
    DONE: "var(--sucess)",
    INCOMING: "var(--attention)",
    CANCELLED: "var(--error)",
    SUSPENDED: "var(--secondary-7)",
  };

  const status = ExamsStatusEnum[type as keyof typeof ExamsStatusEnum];

  return (
    <div
      className={styles.status}
      style={{
        background: bgColor[type as keyof typeof bgColor],
        cursor: pointer ? "pointer" : "default",
      }}
    >
      {status?.replace("_", " ")}
      <DonutLarge />
    </div>
  );
}
