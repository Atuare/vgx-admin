import { TrainingCreateModal } from "@/components/Modals/TrainingCreateModal";
import { DataTable } from "@/components/Table";
import { useTableParams } from "@/hooks/useTableParams";
import { IQuestion } from "@/interfaces/tests.interface";
import { Toast } from "@/utils/toast";
import { Table, createColumnHelper } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Actions } from "../components/Actions";

interface TrainingCreateTableProps {
  questions: Partial<IQuestion>[];
  setTable: (table: Table<any>) => void;
  handleSetQuestions: (questions: Partial<IQuestion>[]) => void;
  defaultTableSize: number;
}
export function TrainingCreateTable({
  setTable,
  questions,
  handleSetQuestions,
  defaultTableSize,
}: TrainingCreateTableProps) {
  const { get } = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );
  const { setParams } = useTableParams();

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  const handleDeleteQuestion = (id: string) => {
    const newQuestions = questions?.filter(question => question?.id !== id);
    handleSetQuestions(newQuestions);
    setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    Toast("success", "Questão deletada com sucesso!");
  };

  const handleEditQuestion = (newQuestion: IQuestion, questionId: string) => {
    const { id, ...rest } = newQuestion;
    const newQuestions = questions?.map(question => {
      if (question?.id === questionId) {
        return {
          ...rest,
        };
      }
      return question;
    });
    handleSetQuestions(newQuestions);
    Toast("success", "Questão editada com sucesso!");
  };

  const columnHelper = createColumnHelper<IQuestion>();
  const columns = [
    columnHelper.accessor("index", {
      header: "Número",
      cell: row => (
        <div style={{ fontSize: 14, fontWeight: 700 }}>
          Questão {row.getValue()}:
        </div>
      ),
    }),
    columnHelper.accessor("text", {
      header: "Texto",
      cell: row => <div>{row.getValue()}</div>,
    }),
    {
      header: "Ação",
      id: "action",
      cell: (row: any) => {
        return (
          <Actions
            handleDelete={() => handleDeleteQuestion(row.row.original.id)}
            value="essa questão"
            EditModal={
              <TrainingCreateModal
                handleOnSubmit={data =>
                  handleEditQuestion(data, row.row.original.id)
                }
                defaultValue={row.row.original}
              />
            }
          />
        );
      },
    },
  ];

  const firstIndex = (currentPage - 1) * defaultTableSize;
  const lastIndex = firstIndex + defaultTableSize;

  const questionsSplited = questions?.slice(firstIndex, lastIndex);

  useEffect(() => {
    setParams("page", String(currentPage));
  }, [currentPage]);

  if (questions.length === 0) return;

  return (
    <DataTable
      data={questionsSplited}
      size={questions.length}
      columns={columns}
      setTable={setTable}
      defaultTableSize={defaultTableSize}
      currentPage={currentPage}
      handleTogglePage={handleTogglePage}
      primary2Color
    />
  );
}
