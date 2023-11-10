import { Cancel, CheckCircle, Unchecked, Warning } from "@/assets/Icons";
import { ExamClassCandidateStatusEnum } from "@/enums/status.enum";
import { CandidacyType } from "@/interfaces/candidacy.interface";
import styles from "./CandidateStatus.module.scss";

interface CandidateStatusProps {
  data: CandidacyType;
}

export function CandidateStatus({ data }: CandidateStatusProps) {
  const examStatus =
    ExamClassCandidateStatusEnum[
      String(data.examStatus) as keyof typeof ExamClassCandidateStatusEnum
    ];

  return (
    <div className={styles.status}>
      <StatusItem title="PROVA" type={data.testResult?.status} />
      <StatusItem title="ENTREVISTA" type={data.interview?.status} />
      <StatusItem title="DOCUMENTO" type="AREALIZAR" />
      <StatusItem title="TREINAMENTO" type={data.training?.status} />
      <StatusItem title="EXAME ADM." type={examStatus} />
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
    | "CONCLUIDO"
    | "APTO"
    | "INAPTO"
    | "AUSENTE";
}) {
  const icons = {
    APROVADO: <CheckCircle />,
    APTO: <CheckCircle />,
    ASSINADO: <CheckCircle />,
    CONCLUIDO: <CheckCircle />,
    AREALIZAR: <Unchecked />,
    VERIFICACAO: <Warning />,
    ANDAMENTO: <Warning />,
    PENDENTE: <Warning />,
    EM_ANDAMENTO: <Warning />,
    "EM ANDAMENTO": <Warning />,
    AUSENTE: <Warning />,
    INAPTO: <Cancel />,
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
