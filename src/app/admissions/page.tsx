"use client";
import { AddCircle, Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import FlatText from "@/components/FlatText";
import { SearchInput } from "@/components/SearchInput";
import { DataTable } from "@/components/Table";
import { FilterButton } from "@/components/Table/Filters/FilterButton";
import { AdmissionsStatusEnum } from "@/enums/status.enum";
import { useTableParams } from "@/hooks/useTableParams";
import { IAdmission, IAdmissions } from "@/interfaces/admissions.interface";
import {
  useGetAllAdmissionsQuery,
  useGetAllUnitsQuery,
} from "@/services/api/fetchApi";
import { getAllAdmissions } from "@/utils/admissions";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import styles from "./Admissions.module.scss";
dayjs.extend(utc);

const defaultTableSize = 5;

export default function Admmissions() {
  const [admissions, setAdmissions] = useState<IAdmissions>();
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [table, setTable] = useState<Table<any>>();
  const [unitsOptions, setUnitsOptions] = useState<string[]>([]);
  const [examinersOptions, setExaminersOptions] = useState<string[]>([]);

  const { push } = useRouter();
  const { get } = useSearchParams();
  const { setParams } = useTableParams();

  const [currentPage, setCurrentPage] = useState<number>(
    get("page") ? Number(get("page")) : 1,
  );

  const { data: units, isSuccess: unitsSuccess } = useGetAllUnitsQuery({
    page: 1,
    size: 9999,
  });

  const { data, isSuccess, isFetching, refetch } = useGetAllAdmissionsQuery({
    page: currentPage,
    size: defaultTableSize,
  });

  const handleInputValue = (value: string) => {
    setGlobalFilter(value);
  };

  const getAdmissions = async (page: number) => {
    const data = await getAllAdmissions(page, 2);

    setAdmissions(data);
  };

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  const getFilterValues = (column: string) => {
    const paramsValue = get(column);
    if (paramsValue) {
      const paramsArray = paramsValue.split(",");
      table?.getColumn(column)?.setFilterValue(paramsArray);
    }
  };

  const handleGoClassPage = (rowIndex: number) => {
    admissions!.admissions.map((admission, index) => {
      if (rowIndex === index) {
        push(`/admissions/${admission.id}`);
      }
    });
  };

  const getAllExaminers = () => {
    const examiners: string[] = [];
    admissions?.admissions.map(admission => {
      if (examiners.length === 0) {
        examiners.push(admission.examiner);
      } else {
        if (examiners.find(examiner => examiner !== admission.examiner)) {
          examiners.push(admission.examiner);
        }
      }
    });

    examiners && setExaminersOptions(examiners);
  };

  const columnHelper = createColumnHelper<IAdmission>();
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
    columnHelper.accessor(
      ({ status }) => {
        const accessor =
          AdmissionsStatusEnum[status as keyof typeof AdmissionsStatusEnum];

        return accessor;
      },
      {
        header: "Status",
        cell: row => {
          const value = row.getValue().replace(/\s/g, "");

          const status =
            AdmissionsStatusEnum[
              String(value) as keyof typeof AdmissionsStatusEnum
            ];

          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => handleGoClassPage(row.row.index)}
            >
              <FlatText text={status} type={status} />
            </div>
          );
        },
      },
    ),
    columnHelper.accessor("candidates", {
      header: "Quantidade",
      cell: row => {
        return <div>{row.getValue()}</div>;
      },
    }),
    columnHelper.accessor(
      value => dayjs(value.startDate).utc().format("DD/MM/YYYY"),
      {
        header: "Data admissão",
        cell: row => {
          return <div>{row.getValue()}</div>;
        },
      },
    ),
    columnHelper.accessor(
      value => dayjs(value.endDate).utc().format("DD/MM/YYYY"),
      {
        header: "Data Limite",
        cell: row => {
          return <div>{row.getValue()}</div>;
        },
      },
    ),
    columnHelper.accessor("unit.unitName", {
      header: () => (
        <FilterButton
          title="Unidade/Site"
          table={table}
          options={unitsOptions}
          column="unit_unitName"
        />
      ),
      cell: row => {
        return <div>{row.getValue()}</div>;
      },
      filterFn: (row, id, value) => {
        return value.length !== 0 ? value.includes(row.getValue(id)) : true;
      },
    }),
    columnHelper.accessor("examiner", {
      header: () => (
        <FilterButton
          title="Examinador"
          table={table}
          options={examinersOptions}
          column="examiner"
        />
      ),
      cell: row => {
        return <div>{row.getValue()}</div>;
      },
      filterFn: (row, id, value) => {
        return value.length !== 0 ? value.includes(row.getValue(id)) : true;
      },
    }),
  ];

  function downloadTableExcelHandler() {
    const selectedRows = table
      ?.getSelectedRowModel()
      .flatRows.map(row => row.original);

    const columnHeaders = [
      "Status",
      "Quantidade",
      "Data admissão",
      "Data Limite",
      "Unidade/Site",
      "Examinador",
    ];

    if (selectedRows && selectedRows.length > 0) {
      const excelData = selectedRows.map(row => ({
        status:
          AdmissionsStatusEnum[row.status as keyof typeof AdmissionsStatusEnum],
        candidates: row.candidates,
        startDate: dayjs(row.startDate).utc().format("DD/MM/YYYY"),
        endDate: dayjs(row.endDate).utc().format("DD/MM/YYYY"),
        unit: row.unit.unitName,
        examiner: row.examiner,
      }));

      downloadExcel({
        fileName: `Admissão`,
        sheet: `Admissão pag. ${currentPage}`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    } else {
      const rows = table?.getRowModel().flatRows.map(row => row.original);

      if (rows && rows.length > 0) {
        const excelData = rows.map(row => ({
          status:
            AdmissionsStatusEnum[
              row.status as keyof typeof AdmissionsStatusEnum
            ],
          candidates: row.candidates,
          startDate: dayjs(row.startDate).utc().format("DD/MM/YYYY"),
          endDate: dayjs(row.endDate).utc().format("DD/MM/YYYY"),
          unit: row.unit.unitName,
          examiner: row.examiner,
        }));

        downloadExcel({
          fileName: `Admissão`,
          sheet: `Admissão pag. ${currentPage}`,
          tablePayload: {
            header: columnHeaders,
            body: excelData,
          },
        });
      }
    }
  }

  useEffect(() => {
    getFilterValues("unit_unitName");
  }, [table]);

  useEffect(() => {
    setParams("page", String(currentPage));
    refetch();
  }, [currentPage]);

  useEffect(() => {
    if (unitsSuccess) {
      setUnitsOptions(units.units.map(unit => unit.unitName));
    }
  }, [unitsSuccess]);

  useEffect(() => {
    isSuccess && setAdmissions(data);
  }, [isSuccess, isFetching]);

  useEffect(() => {
    getAllExaminers();
  }, [admissions]);

  return (
    <div className={styles.admissions}>
      <div className={styles.admissions__actions}>
        <Button
          text="Exportar dados"
          buttonType="secondary"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
        />

        <SearchInput handleChangeValue={handleInputValue} icon={<Search />} />

        <Button
          text="Nova turma Admissão"
          buttonType="primary"
          icon={<AddCircle />}
          onClick={() => push("/admissions/create")}
        />
      </div>

      {admissions && examinersOptions && (
        <DataTable
          data={admissions.admissions}
          columns={columns}
          currentPage={currentPage}
          defaultTableSize={defaultTableSize}
          handleTogglePage={handleTogglePage}
          setTable={setTable}
          size={admissions.totalCount}
          globalFilterValue={globalFilter}
          loading={isFetching}
        />
      )}
    </div>
  );
}
