import { DataTable } from "@/components/Table";
import { useTableParams } from "@/hooks/useTableParams";
import {
  CandidacyStatusEnum,
  CandidacyType,
} from "@/interfaces/candidacy.interface";
import { TrainingType } from "@/interfaces/training.interface";
import { useGetTrainingByIdQuery } from "@/services/api/fetchApi";
import { formatCpf } from "@/utils/formatCpf";
import { formatRG } from "@/utils/formatRg";
import { formatTimeRange } from "@/utils/formatTimeRange";
import { formatWhatsappNumber } from "@/utils/phoneFormating";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter, useSearchParams } from "next/navigation";
import { RefObject, forwardRef, useEffect, useState } from "react";
import { Checkbox } from "../../Checkbox";
import FlatText from "../../FlatText";
import styles from "./TrainingDetailsTable.module.scss";
dayjs.extend(utc);

interface TrainingDetailsTableProps {
  trainingId: string;
  globalFilter?: string;
  tableRef?: RefObject<HTMLButtonElement>;
}

const defaultTableSize = 5;

// eslint-disable-next-line react/display-name
export const TrainingDetailsTable = forwardRef<
  HTMLButtonElement,
  TrainingDetailsTableProps
>((props, ref) => {
  const [table, setTable] = useState<Table<any>>();
  const [training, setTraining] = useState<TrainingType>();

  const { get } = useSearchParams();

  const [currentPage, setCurrentPage] = useState<number>(
    get("page") ? Number(get("page")) : 1,
  );

  const { push } = useRouter();
  const { setParams } = useTableParams();

  const { data, isSuccess, isFetching, refetch } = useGetTrainingByIdQuery({
    id: props.trainingId,
  });

  const handleTogglePage = async (page: number) => {
    setCurrentPage(page + 1);
  };

  const columnHelper = createColumnHelper<CandidacyType>();

  const columns = [
    columnHelper.accessor("id", {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <Checkbox
          {...{
            isActive: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            onChangeCheckbox: () => row?.toggleSelected(),
          }}
          iconType="solid"
          style={{ padding: 0, transform: "translateY(-2px)" }}
        />
      ),
    }),
    columnHelper.accessor("candidate.name", {
      header: "Nome",
      cell: row => {
        return <div style={{ cursor: "pointer" }}>{row.getValue()}</div>;
      },
    }),
    columnHelper.accessor("candidate.cpf", {
      header: "CPF",
      cell: row => {
        return <div>{formatCpf(row.getValue())}</div>;
      },
    }),
    columnHelper.accessor("candidate.documents.identity.rg", {
      header: "RG",
      cell: row => {
        return <div>{formatRG(row.getValue())}</div>;
      },
    }),
    columnHelper.accessor("candidate.whatsapp", {
      header: "WhatsApp",
      cell: row => {
        return <div>{formatWhatsappNumber(row.getValue())}</div>;
      },
    }),
    columnHelper.accessor("availability", {
      header: "Disponibilidade",
      cell: row => {
        return <div>{formatTimeRange(row.getValue())}</div>;
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: row => {
        const rowStatusValue = row.getValue();
        const status =
          CandidacyStatusEnum[
            rowStatusValue as keyof typeof CandidacyStatusEnum
          ];

        return <FlatText text={status} type={status} />;
      },
    }),
  ];

  useEffect(() => {
    setParams("page", String(currentPage));
    refetch();
  }, [currentPage]);

  useEffect(() => {
    if (isSuccess) {
      setTraining(data.data);
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    if (training) {
      // getAllFilters();
    }
  }, [training]);

  if (!training) return null;

  return (
    <section className={styles.trainingDetails__list}>
      <DataTable
        data={training.candidacies}
        size={5}
        columns={columns}
        setTable={setTable}
        ref={ref}
        defaultTableSize={defaultTableSize}
        currentPage={currentPage}
        handleTogglePage={handleTogglePage}
        globalFilterValue={props.globalFilter}
        tableName="Treinamentos"
      />
    </section>
  );
});
