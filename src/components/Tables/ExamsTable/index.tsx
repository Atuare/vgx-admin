import { Checkbox } from "@/components/Checkbox";
import FlatText from "@/components/FlatText";
import { DataTable } from "@/components/Table";
import { DateTimeFilterButton } from "@/components/Table/Filters/DateTimeFilterButton";
import { FilterButton } from "@/components/Table/Filters/FilterButton";
import { SearchFilterButton } from "@/components/Table/Filters/SearchFilterButton";
import { ExamsStatusEnum } from "@/enums/status.enum";
import { IExam, IExams } from "@/interfaces/exams.interface";
import {
  useGetAllExaminersQuery,
  useGetAllExamsQuery,
} from "@/services/api/fetchApi";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
dayjs.extend(utc);

interface ExamsTableProps {
  setTable: (table: any) => void;
  table: any;
  globalFilter?: string;
  defaultTableSize: number;
}

export function ExamsTable({
  setTable,
  table,
  globalFilter,
  defaultTableSize,
}: ExamsTableProps) {
  const [exams, setExams] = useState<IExams>();
  const [examiners, setExaminers] = useState<string[]>([]);

  const { push } = useRouter();

  const { get } = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    get("page") ? Number(get("page")) : 1,
  );

  const { data, isFetching, isSuccess, refetch } = useGetAllExamsQuery({}); // ! FIX: This hook should not require any property but is requiring, so a temporary object is being passed.

  const {
    data: examinersData,
    isFetching: examinersIsFetching,
    isSuccess: examinersIsSuccess,
  } = useGetAllExaminersQuery({});

  const handleTogglePage = (page: number) => setCurrentPage(page + 1);

  const columnHelper = createColumnHelper<IExam>();
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
    columnHelper.accessor("status", {
      header: "Status",
      cell: row => {
        const value = row.getValue();
        const status = ExamsStatusEnum[
          String(value) as keyof typeof ExamsStatusEnum
        ].replace("_", " ");

        return (
          <div
            style={{ cursor: "pointer" }}
            //   onClick={() => handleGoClassPage(row.row.index)}
          >
            <FlatText text={status} type={status} />
          </div>
        );
      },
    }),
    columnHelper.accessor("candidateLimit", {
      header: "Quantidade",
      cell: ({ row }) => {
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => push(`/exams/${row.original.id}`)}
          >
            {row.getValue("candidateLimit")}
          </div>
        );
      },
    }),
    columnHelper.accessor(
      value =>
        `${dayjs(value.startDate).utc().format("DD/MM/YYYY")}-${dayjs(
          value.time,
        ).format("HH:MM")}`,
      {
        id: "dateandtime",
        header: () => (
          <DateTimeFilterButton
            column="dateandtime"
            table={table}
            title="Data e hora"
          />
        ),
        cell: row => {
          const date = row.getValue().split("-")[0];
          const hour = row.getValue().split("-")[1];

          return (
            <div>
              {date} {hour}
            </div>
          );
        },
        filterFn: (row, id, value) => {
          const rowDate = String(row.getValue(id)).split("-")[0];
          const rowHour = String(row.getValue(id)).split("-")[1];

          const filterDate =
            value[0] && dayjs(value[0]).isValid()
              ? dayjs(value[0]).utc().format("DD/MM/YYYY")
              : rowDate;
          const filterHour = value[1] ? value[1] : rowHour;

          if (value.length !== 0) {
            return rowDate === filterDate && rowHour === filterHour;
          } else {
            return true;
          }
        },
      },
    ),
    columnHelper.accessor("examiner", {
      header: () => (
        <FilterButton
          column="examiner"
          options={examiners}
          table={table}
          title="Examinador"
        />
      ),
      cell: row => <div>{row.getValue()}</div>,
      filterFn: (row, id, value) => {
        return value.length !== 0 ? value.includes(row.getValue(id)) : true;
      },
    }),
    columnHelper.accessor("location", {
      header: () => (
        <SearchFilterButton column="local" table={table} title="Local" />
      ),
      cell: row => <div>{row.getValue()}</div>,
      filterFn: (row, id, value) => {
        return String(row.getValue(id))
          .toLowerCase()
          .includes(value.toLowerCase());
      },
    }),
  ];

  useEffect(() => {
    isSuccess && setExams(data);
  }, [isSuccess, isFetching]);

  useEffect(() => {
    if (examinersIsSuccess) {
      const newExaminers: string[] = [];
      examinersData.data.map((exam: any) => {
        if (newExaminers.includes(exam.examiner)) return;

        newExaminers.push(exam.examiner);
      });

      setExaminers(newExaminers);
    }
  }, [examinersIsSuccess, examinersIsFetching]);

  if (!exams || !examiners) return <p>Exames admissionais indisponíveis</p>;

  return (
    <section>
      <DataTable
        columns={columns}
        data={exams.data}
        size={exams.data.length}
        currentPage={currentPage}
        defaultTableSize={defaultTableSize}
        handleTogglePage={handleTogglePage}
        setTable={setTable}
        globalFilterValue={globalFilter}
      />
    </section>
  );
}
