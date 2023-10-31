export enum StatusEnum {
  ATIVO = "ATIVO",
  INATIVO = "INATIVO",
}

export enum AdmissionsStatusEnum {
  "EMANDAMENTO" = "EM ANDAMENTO",
  SUSPENSO = "SUSPENSO",
  CONCLUÍDO = "CONCLUÍDO",
  CANCELADO = "CANCELADO",
}

export enum AdmissionContractStatusEnum {
  PENDENTE = "PENDENTE",
  ASSINADO = "ASSINADO",
  NAOASSINADO = "NÃO ASSINADO",
}

export enum DocumentStatusEnum {
  PENDENTE = "PENDENTE",
  APROVADO = "APROVADO",
  REPROVADO = "REPROVADO",
  EMANALISE = "EM ANÁLISE",
  DESISTENTE = "DESISTENTE",
  NAOENVIADO = "NÃO ENVIADO",
}

export enum DocumentCandidateStatusEnum {
  PENDENTE = "PENDENTE",
  APROVADO = "APROVADO",
  REPROVADO = "REPROVADO",
}

export enum ExamsStatusEnum {
  INCOMING = "EM_ANDAMENTO",
  SUSPENDED = "SUSPENSO",
  DONE = "CONCLUÍDO",
  CANCELLED = "CANCELADO",
}

export enum ExamClassCandidateStatusEnum {
  "ABLE" = "APTO",
  "UNABLE" = "INAPTO",
  "PENDING" = "PENDENTE",
  "ABSENT" = "AUSENTE",
}
