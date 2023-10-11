import {
  DocumentCandidateStatusEnum,
  DocumentStatusEnum,
  StatusEnum,
} from "@/enums/status.enum";
import { fetchApi } from "@/services/api/fetchApi";
import { store } from "@/store/store";

export async function getAllDocuments(page: number, defaultTableSize: number) {
  const { data } = await store.dispatch<any>(
    fetchApi.endpoints.getAllDocuments.initiate({
      page: page,
      size: defaultTableSize,
    }),
  );

  return data;
}

export const fakeDocumentsData = {
  documents: [
    {
      id: "79e39ee0-67bc-11ee-8c99-0242ac120002",
      status: DocumentStatusEnum.PENDENTE,
      cpf: "12345678910",
      name: "João da Silva",
      whatsapp: "5511123456789",
      unit: {
        id: "a88698fe-1d91-41a4-8414-5b3a83f34798",
        unitName: "DONALDS",
        unitAcronym: "MAC",
        unitAddress: "DONALDS N23",
        status: StatusEnum.ATIVO,
        createdAt: "2023-08-29T02:09:30.050Z",
        updatedAt: "2023-08-29T02:09:30.050Z",
      },
      documents: [
        {
          id: "79e39ee0-67bc-11ee-8c99-0242ac12",
          status: DocumentCandidateStatusEnum.PENDENTE,
          name: "Documento 1",
          observation: "Observação do Documento 1",
          mandatory: true,
          createdAt: "2023-10-10T10:00:00.000Z",
          updatedAt: "2023-10-10T10:00:00.000Z",
        },
        {
          id: "80923d50-67bc-11ee-8c99-0242ac12",
          status: DocumentCandidateStatusEnum.APROVADO,
          name: "Documento 2",
          observation: "Observação do Documento 2",
          mandatory: false,
          createdAt: "2023-10-10T10:00:00.000Z",
          updatedAt: "2023-10-10T10:00:00.000Z",
        },
        {
          id: "85653b70-67bc-11ee-8c99-0242ac12",
          status: DocumentCandidateStatusEnum.REPROVADO,
          name: "Documento 3",
          observation: "Observação do Documento 3",
          mandatory: true,
          createdAt: "2023-10-10T10:00:00.000Z",
          updatedAt: "2023-10-10T10:00:00.000Z",
        },
        {
          id: "890cfa60-67bc-11ee-8c99-0242ac12",
          status: DocumentCandidateStatusEnum.REPROVADO,
          name: "Documento 4",
          observation: "Observação do Documento 4",
          mandatory: true,
          createdAt: "2023-10-10T10:00:00.000Z",
          updatedAt: "2023-10-10T10:00:00.000Z",
        },
        {
          id: "120cga60-67bc-11ee-8c99-0242ac12",
          status: DocumentCandidateStatusEnum.PENDENTE,
          name: "Documento 5",
          observation: "Observação do Documento 5",
          mandatory: false,
          createdAt: "2023-10-10T10:00:00.000Z",
          updatedAt: "2023-10-10T10:00:00.000Z",
        },
        {
          id: "122cga60-67bc-11ee-8c99-0242ac12",
          status: DocumentCandidateStatusEnum.APROVADO,
          name: "Documento 6",
          observation: "Observação do Documento 6",
          mandatory: false,
          createdAt: "2023-10-12T10:00:00.000Z",
          updatedAt: "2023-10-12T10:00:00.000Z",
        },
      ],
      createdAt: "2023-08-19T15:12:25.074Z",
    },
    {
      id: "80923d50-67bc-11ee-8c99-0242ac120002",
      status: DocumentStatusEnum.APROVADO,
      cpf: "01395823523",
      name: "Sabrina Rocha da Silva",
      whatsapp: "5581924325945",
      unit: {
        id: "93509f30-ab29-4877-81cd-7ade443b2f19",
        unitName: "Banco do Brasil",
        unitAcronym: "BB",
        unitAddress: "Rua tal n° 15, Estado, Brasil",
        status: StatusEnum.ATIVO,
        createdAt: "2023-08-19T15:11:19.478Z",
        updatedAt: "2023-08-27T03:08:41.086Z",
      },
      documents: [],
      createdAt: "2021-05-01T00:00:00.000Z",
    },
    {
      id: "85653b70-67bc-11ee-8c99-0242ac120002",
      status: DocumentStatusEnum.REPROVADO,
      cpf: "53459484345",
      name: "Enzo Cardoso Silva",
      whatsapp: "5571981234232",
      unit: {
        id: "7df86a51-09bf-4f25-b393-a3f948295533",
        unitName: "Teste de unidade",
        unitAcronym: "TDU",
        unitAddress: "Rua tal tal tal n° 21, Estado, Brasil",
        status: StatusEnum.ATIVO,
        createdAt: "2023-08-15T17:42:41.658Z",
        updatedAt: "2023-09-10T10:35:29.533Z",
      },
      documents: [],
      createdAt: "2022-05-11T00:00:00.000Z",
    },
    {
      id: "890cfa60-67bc-11ee-8c99-0242ac120002",
      status: DocumentStatusEnum.EMANALISE,
      cpf: "98232123456",
      name: "João Ferreira da Silva",
      whatsapp: "5521234567890",
      unit: {
        id: "b47172f1-5119-438c-87a2-8364218fa2ed",
        unitName: "Tesla",
        unitAcronym: "TSL",
        unitAddress: "Rua tal n° 14, São Paulo, Brasil",
        status: StatusEnum.ATIVO,
        createdAt: "2023-08-19T15:11:49.868Z",
        updatedAt: "2023-09-10T10:35:32.942Z",
      },
      documents: [],
      createdAt: "2023-05-01T00:00:00.000Z",
    },
    {
      id: "8ca70d6e-67bc-11ee-8c99-0242ac120002",
      status: DocumentStatusEnum.DESISTENTE,
      cpf: "93421234567",
      name: "Maria da Silva",
      whatsapp: "5511987654321",
      unit: {
        id: "e3606c74-f4f4-423b-9c0c-258c898e0eac",
        unitName: "Agro",
        unitAcronym: "AGR",
        unitAddress: "Rua tal n° 10, Minas Gerais, Brasil",
        status: StatusEnum.ATIVO,
        createdAt: "2023-08-19T15:12:04.117Z",
        updatedAt: "2023-08-24T01:53:32.158Z",
      },
      documents: [],
      createdAt: "2023-05-12T00:00:00.000Z",
    },
    {
      id: "8fb85f26-67bc-11ee-8c99-0242ac120002",
      status: DocumentStatusEnum.NAOENVIADO,
      cpf: "98421234567",
      name: "Lucas Souza Santos",
      whatsapp: "5511987654321",
      unit: {
        id: "a7f9637f-be00-42d5-b569-eed32e936128",
        unitName: "Casas Bahia",
        unitAcronym: "CBA",
        unitAddress: "Rua tal n° 18, Bahia, Brasil",
        status: StatusEnum.ATIVO,
        createdAt: "2023-08-19T15:12:25.074Z",
        updatedAt: "2023-08-24T01:57:48.077Z",
      },
      documents: [],
      createdAt: "2023-08-03T00:00:00.000Z",
    },
  ],
  totalCount: 6,
};

export const documentsStatus = [
  "PENDENTE",
  "APROVADO",
  "REPROVADO",
  "EM ANÁLISE",
  "DESISTENTE",
  "NÃO ENVIADO",
];

export const documentCandidateStatus = ["PENDENTE", "APROVADO", "REPROVADO"];

export const candidateStatusModalOptions = [
  {
    name: "Pendente",
    id: "PENDENTE",
  },
  {
    name: "Em análise",
    id: "EMANALISE",
  },
  {
    name: "Aprovado",
    id: "APROVADO",
  },
  {
    name: "Reprovado",
    id: "REPROVADO",
  },
  {
    name: "Desistente",
    id: "DESISTENTE",
  },
  {
    name: "Não enviado",
    id: "NAOENVIADO",
  },
];

export const candidateStatusModalReasons = [
  {
    name: "Documentos em processo de análise",
    id: "Documentos em processo de análise",
  },
  {
    name: "Documentos ilegíveis",
    id: "Documentos ilegíveis",
  },
  {
    name: "Não enviou todos os documentos",
    id: "Não enviou todos os documentos",
  },
  {
    name: "Desistiu do processo seletivo",
    id: "Desistiu do processo seletivo",
  },
];

export const convertDocumentStatus = {
  PENDENTE: "Pendente",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
  EMANALISE: "Em análise",
  DESISTENTE: "Desistente",
  NAOENVIADO: "Não enviado",
};
