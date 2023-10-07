import { Cancel, CheckCircle, Unchecked, Warning } from "@/assets/Icons";
import { CandidacyType } from "@/interfaces/candidacy.interface";
import styles from "./CandidateStatus.module.scss";

interface CandidateStatusProps {
  data: CandidacyType;
}

export function CandidateStatus({ data }: CandidateStatusProps) {
  return (
    <div className={styles.status}>
      <StatusItem title="PROVA" type={data.testResult} />
      <StatusItem title="ENTREVISTA" type={data.interview?.status} />
      <StatusItem title="DOCUMENTO" type="AREALIZAR" />
      <StatusItem title="TREINAMENTO" type={data.training?.status} />
      <StatusItem title="EXAME ADM." type="AREALIZAR" />
      <StatusItem title="CON" type="NAOASSINADO" />
    </div>
  );
}

function StatusItem({
  title,
  type,
}: {
  title: string;
  type:
    | "APROVADO"
    | "ASSINADO"
    | "AREALIZAR"
    | "PENDENTE"
    | "VERIFICACAO"
    | "ANDAMENTO"
    | "EM_ANDAMENTO"
    | "EM ANDAMENTO"
    | "NAOREALIZADO"
    | "NAOASSINADO"
    | "CANCELADO"
    | "SUSPENSO"
    | "REPROVADO"
    | "CONCLUIDO";
}) {
  const icons = {
    APROVADO: <CheckCircle />,
    ASSINADO: <CheckCircle />,
    CONCLUIDO: <CheckCircle />,
    AREALIZAR: <Unchecked />,
    VERIFICACAO: <Warning />,
    ANDAMENTO: <Warning />,
    PENDENTE: <Warning />,
    EM_ANDAMENTO: <Warning />,
    "EM ANDAMENTO": <Warning />,
    NAOREALIZADO: <Cancel />,
    NAOASSINADO: <Cancel />,
    CANCELADO: <Cancel />,
    SUSPENSO: <Cancel />,
    REPROVADO: <Cancel />,
  };

  return (
    <li className={styles.status__item}>
      <h2>{title.substring(0, 3)}</h2>
      <span>{type}</span>
      {icons[type] ?? icons.AREALIZAR}
    </li>
  );
}
