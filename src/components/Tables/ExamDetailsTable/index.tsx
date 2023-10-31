import { Checkbox } from "@/components/Checkbox";
import FlatText from "@/components/FlatText";
import { ExamStatusModal } from "@/components/Modals/ExamStatusModal";
import { DataTable } from "@/components/Table";
import { FilterButton } from "@/components/Table/Filters/FilterButton";
import { ExamClassCandidateStatusEnum } from "@/enums/status.enum";
import { CandidacyStatusEnum } from "@/interfaces/candidacy.interface";
import { IExamDetail, IExamDetails } from "@/interfaces/exams.interface";

import {
  useGetAllExamClassQuery,
  useGetAllUnitsQuery,
  useUpdateExamClassesCandidacyStatusMutation,
} from "@/services/api/fetchApi";
import { documentsStatus } from "@/utils/documents";
import { examClassCandidateStatus } from "@/utils/exams";
import { formatCpf } from "@/utils/formatCpf";
import { formatRG } from "@/utils/formatRg";
import { formatPhoneNumber } from "@/utils/phoneFormating";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

dayjs.extend(utc);

interface ExamDetailsTableProps {
  examId: string;
  setTable: (table: any) => void;
  table: Table<any>;
  globalFilter?: string;
  defaultTableSize: number;
}

export function ExamDetailsTable({
  examId,
  setTable,
  table,
  globalFilter,
  defaultTableSize,
}: ExamDetailsTableProps) {
  const [examDetails, setExamDetails] = useState<IExamDetails>();
  const [unitsOptions, setUnitsOptions] = useState<string[]>([]);

  const { get } = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const { data, isFetching, isSuccess, refetch } = useGetAllExamClassQuery({
    id: examId,
  });

  const [updateExamStatusClassesCandidacyStatus] =
    useUpdateExamClassesCandidacyStatusMutation({});

  const { data: unitsData, isSuccess: unitsIsSuccess } = useGetAllUnitsQuery({
    page: 1,
    size: 99999,
  });

  const handleTogglePage = (page: number) => setCurrentPage(page + 1);

  const columnHelper = createColumnHelper<IExamDetail>();
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
      id: "name",
      header: "Nome",
      cell: row => {
        return <div>{row.getValue()}</div>;
      },
    }),
    columnHelper.accessor(value => formatCpf(value.candidate.cpf), {
      id: "cpf",
      header: "CPF",
      cell: row => <span>{row.getValue()}</span>,
    }),
    columnHelper.accessor(
      value => formatRG(value.candidate.documents.identity.rg),
      {
        id: "rg",
        header: "RG",
        cell: row => <span>{row.getValue()}</span>,
      },
    ),
    columnHelper.accessor(
      value => dayjs(value.candidate.birthdate).utc().format("DD/MM/YYYY"),
      {
        id: "birthdate",
        header: "Data de nascimento",
        cell: row => <div>{row.getValue()}</div>,
      },
    ),
    columnHelper.accessor(
      value => dayjs(value.candidate.birthdate).utc().format("YY"),
      {
        id: "age",
        header: "Idade",
        cell: row => <div>{row.getValue()} anos</div>,
      },
    ),
    columnHelper.accessor("process.role.roleText", {
      id: "role",
      header: "Função",
      cell: row => {
        return <div>{row.getValue()}</div>;
      },
    }),
    columnHelper.accessor(
      ({ status }) => {
        const accessor =
          CandidacyStatusEnum[status as keyof typeof CandidacyStatusEnum];

        return accessor;
      },
      {
        id: "statusDoc",
        header: () => (
          <FilterButton
            title="Status doc."
            table={table}
            options={documentsStatus}
            column="statusDoc"
          />
        ),
        cell: row => {
          const value = row.getValue().replace(/\s/g, "");

          const status =
            CandidacyStatusEnum[
              String(value) as keyof typeof CandidacyStatusEnum
            ];

          return (
            <div
              style={{ cursor: "pointer" }}
              //   onClick={() => handleGoClassPage(row.row.index)}
            >
              <FlatText text={status} type={status} />
            </div>
          );
        },
        filterFn: (row, id, value) => {
          const newValues = value.map((item: string) =>
            item
              .replace(/\s/g, "")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, ""),
          );

          return value.length !== 0
            ? newValues.includes(row.getValue(id))
            : true;
        },
      },
    ),
    columnHelper.accessor("process.unit.unitName", {
      id: "unit",
      header: () => (
        <FilterButton
          title="Unidade/Site"
          table={table}
          options={unitsOptions}
          column="unit"
        />
      ),
      cell: row => {
        return <div>{row.getValue()}</div>;
      },
      filterFn: (row, id, value) => {
        return value.length !== 0 ? value.includes(row.getValue(id)) : true;
      },
    }),
    columnHelper.accessor("training.productName", {
      id: "productName",
      header: "Produto",
      cell: row => {
        return <div>{row.getValue()}</div>;
      },
    }),
    columnHelper.accessor(value => formatPhoneNumber(value.candidate.phone), {
      id: "phone",
      header: "Telefone",
      cell: row => <span>{row.getValue()}</span>,
    }),
    columnHelper.accessor(
      ({ examStatus }) => {
        const accessor =
          ExamClassCandidateStatusEnum[
            examStatus as unknown as keyof typeof ExamClassCandidateStatusEnum
          ];

        return accessor;
      },
      {
        id: "status",
        header: () => (
          <FilterButton
            title="Status"
            table={table}
            options={examClassCandidateStatus}
            column="status"
          />
        ),
        cell: row => {
          const value = row.getValue().replace(/\s/g, "");

          const status = value;

          return (
            <div
              style={{ cursor: "pointer" }}
              //   onClick={() => handleGoClassPage(row.row.index)}
            >
              <ExamStatusModal handleOnSubmit={changeCandidatesStatusHandler}>
                <FlatText text={status} type={status} />
              </ExamStatusModal>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          const newValues = value.map((item: string) =>
            item
              .replace(/\s/g, "")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, ""),
          );

          return value.length !== 0
            ? newValues.includes(row.getValue(id))
            : true;
        },
      },
    ),
  ];

  function changeCandidatesStatusHandler(data: any) {
    const selectedRows = table
      ?.getSelectedRowModel()
      .flatRows.map(row => row.original);

    const candidaciesIds = selectedRows.map(candidate => candidate.id);

    const status = Object.keys(ExamClassCandidateStatusEnum)[
      Object.values(ExamClassCandidateStatusEnum).indexOf(data.status)
    ];

    updateExamStatusClassesCandidacyStatus({
      examId: examId,
      data: {
        candidacies: candidaciesIds,
        status: status,
        reason: data.reason,
      },
    }).then(() => {
      refetch();
    });
  }

  useEffect(() => {
    if (unitsIsSuccess) {
      setUnitsOptions(unitsData.units.map(unit => unit.unitName));
    }
  }, [unitsIsSuccess]);

  useEffect(() => {
    isSuccess && setExamDetails(data);
  }, [isSuccess, isFetching]);

  if (!examDetails) return <p>Turmas de exame indisponíveis</p>;

  return (
    <section>
      <DataTable
        columns={columns}
        currentPage={currentPage}
        data={examDetails.data}
        globalFilterValue={globalFilter ?? ""}
        defaultTableSize={defaultTableSize}
        handleTogglePage={handleTogglePage}
        setTable={setTable}
        size={examDetails.data.length}
        loading={isFetching}
      />
    </section>
  );
}
