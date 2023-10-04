import { Cancel, CheckCircle, Unchecked, Warning } from "@/assets/Icons";
import styles from "./ModalStatus.module.scss";

export function ModalStatus() {
  return (
    <section className={styles.container}>
      <StatusItem title="Prova" type="APROVADO" />
      <StatusItem title="Entrevista" type="AREALIZAR" />
      <StatusItem title="Documentos" type="VERIFICACAO" />
      <StatusItem title="Treinamento" type="NAOREALIZADO" />
      <StatusItem title="Exame adm." type="NAOREALIZADO" />
      <StatusItem title="Ass. Contrato" type="NAOREALIZADO" />
    </section>
  );
}

function StatusItem({
  title,
  type,
}: {
  title: string;
  type: "APROVADO" | "AREALIZAR" | "VERIFICACAO" | "NAOREALIZADO";
}) {
  const messages = {
    APROVADO: "Aprovado",
    AREALIZAR: "A Realizar",
    VERIFICACAO: "Em Verificação",
    NAOREALIZADO: "Não Realizado",
  };

  const icons = {
    APROVADO: <CheckCircle />,
    AREALIZAR: <Unchecked />,
    VERIFICACAO: <Warning />,
    NAOREALIZADO: <Cancel />,
  };

  return (
    <div className={styles.item}>
      <h4 className={styles.item__title}>{title}</h4>
      {icons[type]}
      <p className={styles.item__message}>{messages[type]}</p>
    </div>
  );
}
