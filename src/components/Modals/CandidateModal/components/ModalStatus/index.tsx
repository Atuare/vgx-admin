import { Cancel, CheckCircle, Unchecked, Warning } from "@/assets/Icons";
import { ExamClassCandidateStatusEnum } from "@/enums/status.enum";
import { CandidacyType } from "@/interfaces/candidacy.interface";
import styles from "./ModalStatus.module.scss";

interface ModalStatusProps {
  data: CandidacyType;
}

export function ModalStatus({ data }: ModalStatusProps) {
  const examStatus =
    ExamClassCandidateStatusEnum[
      String(data.examStatus) as keyof typeof ExamClassCandidateStatusEnum
    ];

  const getStatus = () => {
    switch (data.process.requestCv) {
      case true:
        return (
          <>
            <StatusItem title="Entrevista" type={data.interview?.status} />
            <StatusItem title="Documentos" type="AREALIZAR" />
            <StatusItem title="Exame adm." type="AREALIZAR" />
            <StatusItem title="Ass. Contrato" type="AREALIZAR" />
          </>
        );
      default:
        return (
          <>
            <StatusItem title="Prova" type={data.testResult?.status} />
            <StatusItem title="Entrevista" type={data.interview?.status} />
            <StatusItem title="Documentos" type="AREALIZAR" />
            <StatusItem title="Treinamento" type={data.training?.status} />
            <StatusItem title="Exame adm." type={examStatus} />
            <StatusItem title="Ass. Contrato" type="AREALIZAR" />
          </>
        );
    }
  };

  return <section className={styles.container}>{getStatus()}</section>;
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
  const messages = {
    APROVADO: "Aprovado",
    ASSINADO: "Assinado",
    CONCLUIDO: "Concluído",
    ANDAMENTO: "Em Andamento",
    PENDENTE: "Pendente",
    EM_ANDAMENTO: "Em Andamento",
    "EM ANDAMENTO": "Em Andamento",
    AREALIZAR: "A Realizar",
    VERIFICACAO: "Em Verificação",
    NAOREALIZADO: "Não Realizado",
    NAOASSINADO: "Não Assinado",
    CANCELADO: "Cancelado",
    SUSPENSO: "Suspenso",
    REPROVADO: "Reprovado",
    APTO: "Apto",
    INAPTO: "Inapto",
    AUSENTE: "Ausente",
  };

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
    <div className={styles.item}>
      <h4 className={styles.item__title}>{title}</h4>
      {icons[type] ?? icons.AREALIZAR}
      <p className={styles.item__message}>{messages[type] ?? "A Realizar"}</p>
    </div>
  );
}
