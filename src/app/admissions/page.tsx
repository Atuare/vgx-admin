"use client";
import { AddCircle, Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { FilterButton } from "@/components/FilterButton";
import FlatText from "@/components/FlatText";
import { SearchInput } from "@/components/SearchInput";
import { DataTable } from "@/components/Table";
import { AdmissionsStatusEnum } from "@/enums/status.enum";
import { useTableParams } from "@/hooks/useTableParams";
import { IAdmission, IAdmissions } from "@/interfaces/admissions.interface";
import { useGetAllUnitsQuery } from "@/services/api/fetchApi";
import { getAllAdmissions } from "@/utils/admissions";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import styles from "./Admissions.module.scss";
dayjs.extend(utc);

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

  const handleInputValue = (value: string) => {
    setGlobalFilter(value);
  };

  const getAdmissions = async (page: number) => {
    const data = await getAllAdmissions(page, 2);

    setAdmissions(data);
  };

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
    getAdmissions(page + 1);
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
    const examiners = admissions?.admissions.map(
      admission => admission.examiner,
    );

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
          iconType="outline"
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

          return <FlatText text={status} type={status} />;
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
  }, [currentPage]);

  useEffect(() => {
    if (unitsSuccess) {
      setUnitsOptions(units.units.map(unit => unit.unitName));
    }
  }, [unitsSuccess]);

  useEffect(() => {
    admissions && getAllExaminers();
  }, [admissions]);

  useEffect(() => {
    getAdmissions(1);
    getAllExaminers();
  }, []);

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
        />
      </div>

      {admissions && examinersOptions && (
        <DataTable
          data={admissions.admissions}
          columns={columns}
          currentPage={currentPage}
          defaultTableSize={2}
          handleTogglePage={handleTogglePage}
          setTable={setTable}
          size={admissions.totalCount}
          globalFilterValue={globalFilter}
        />
      )}
    </div>
  );
}
