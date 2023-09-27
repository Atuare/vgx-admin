import { TestCreateModal } from "@/components/Modals/TestCreateModal";
import { DataTable } from "@/components/Table";
import { QuestionTypeEnum } from "@/enums/test.enum";
import { IQuestion } from "@/interfaces/tests.interface";
import { Toast } from "@/utils/toast";
import { Table, createColumnHelper } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Actions } from "../components/Actions";

interface TestsCreateTableProps {
  setTable: (table: Table<any>) => void;
}

const defaultTableSize = 5;

const example = [
  {
    id: "ee408aa7-6cff-46da-9fc7-6b80adf34179",
    text: "questão de portu",
    type: "PORTUGUESE",
    createdAt: "2023-09-21T01:45:32.300Z",
    updatedAt: "2023-09-21T01:45:32.300Z",
    alternatives: [
      {
        id: "a6319844-4794-477b-9d5f-61cce22c7bc7",
        alternative: "a",
        createdAt: "2023-09-21T01:45:32.300Z",
        updatedAt: "2023-09-21T01:45:32.300Z",
      },
      {
        id: "bc0f1ac6-925a-4e6a-b2fb-96d4c8625699",
        alternative: "b",
        createdAt: "2023-09-21T01:45:32.300Z",
        updatedAt: "2023-09-21T01:45:32.300Z",
      },
    ],
  },
  {
    id: "8b4e2d3b-c6d9-496a-b400-f684f8ec08a8",
    text: "questão de math",
    type: "MATHEMATICS",
    createdAt: "2023-09-21T01:45:32.300Z",
    updatedAt: "2023-09-21T01:45:32.300Z",
    alternatives: [
      {
        id: "3a233e60-87f7-4203-a14b-45a4aebdb716",
        alternative: "a",
        createdAt: "2023-09-21T01:45:32.300Z",
        updatedAt: "2023-09-21T01:45:32.300Z",
      },
      {
        id: "b7f238c9-5017-49df-a029-08eb3a987687",
        alternative: "b",
        createdAt: "2023-09-21T01:45:32.300Z",
        updatedAt: "2023-09-21T01:45:32.300Z",
      },
    ],
  },
  {
    id: "f763fcfb-8b0d-4a93-a361-cb0bb7cd2f75",
    text: "questão de computação",
    type: "COMPUTING",
    createdAt: "2023-09-21T01:45:32.300Z",
    updatedAt: "2023-09-21T01:45:32.300Z",
    alternatives: [
      {
        id: "6e627a77-6c52-4011-9bfd-134c82fc818d",
        alternative: "a",
        createdAt: "2023-09-21T01:45:32.300Z",
        updatedAt: "2023-09-21T01:45:32.300Z",
      },
      {
        id: "ada4ae22-2666-4c5a-9fa1-61e7018a990d",
        alternative: "b",
        createdAt: "2023-09-21T01:45:32.300Z",
        updatedAt: "2023-09-21T01:45:32.300Z",
      },
    ],
  },
];

export function TestsCreateTable({ setTable }: TestsCreateTableProps) {
  const [questions, setQuestions] = useState<Partial<IQuestion[]>>(example);

  const { get } = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  const handleDeleteQuestion = (id: string) => {
    const newQuestions = questions?.filter(question => question?.id !== id);
    setQuestions(newQuestions);
    Toast("success", "Questão deletada com sucesso!");
  };

  const columnHelper = createColumnHelper<IQuestion>();
  const columns = [
    {
      header: "Número",
      id: "number",
      cell: ({ row }: { row: any }) => (
        <div style={{ fontSize: 14, fontWeight: 700 }}>
          Questão {row.index + 1}:
        </div>
      ),
    },
    columnHelper.accessor("text", {
      header: "Texto",
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor("type", {
      header: "Tipo",
      cell: row => (
        <div>
          {QuestionTypeEnum[row.getValue() as keyof typeof QuestionTypeEnum]}
        </div>
      ),
    }),
    {
      header: "Ação",
      id: "action",
      cell: (row: any) => {
        return (
          <Actions
            handleDelete={() => handleDeleteQuestion(row.row.original.id)}
            value="Nova questão"
            EditModal={
              <TestCreateModal
                handleOnSubmit={() => {}}
                defaultValue={row.row.original}
              />
            }
          />
        );
      },
    },
  ];

  if (!questions) return;

  return (
    <DataTable
      data={questions}
      size={questions.length}
      columns={columns}
      setTable={setTable}
      defaultTableSize={defaultTableSize}
      currentPage={currentPage}
      handleTogglePage={handleTogglePage}
    />
  );
}
