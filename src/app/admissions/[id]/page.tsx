"use client";
import {
  DonutLarge,
  EditSquare,
  Search,
  SystemUpdate,
  TaskAlt,
} from "@/assets/Icons";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { FilterButton } from "@/components/FilterButton";
import { SaveModal } from "@/components/SaveModal";
import { SearchInput } from "@/components/SearchInput";
import { DataTable } from "@/components/Table";
import { AdmissionsStatusEnum } from "@/enums/status.enum";
import { useTableParams } from "@/hooks/useTableParams";
import {
  IAdmission,
  IAdmissionCandidate,
} from "@/interfaces/admissions.interface";
import {
  useGetAdmissionQuery,
  useGetAllUnitsQuery,
} from "@/services/api/fetchApi";
import { getAdmissionById } from "@/utils/admissions";
import { formatCpf } from "@/utils/formatCpf";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Admission.module.scss";
dayjs.extend(utc);

export default function AdmissionClass() {
  const [admission, setAdmission] = useState<IAdmission>();
  const [candidates, setCandidates] = useState<IAdmissionCandidate[]>();
  const [totalCount, setTotalCount] = useState<number>();
  const [unitsOptions, setUnitsOptions] = useState<string[]>([]);
  const [table, setTable] = useState<Table<any>>();
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const pathname = usePathname();
  const { push } = useRouter();
  const { get } = useSearchParams();
  const { setParams } = useTableParams();

  const [currentPage, setCurrentPage] = useState<number>(
    get("page") ? Number(get("page")) : 1,
  );

  const { data, isSuccess } = useGetAdmissionQuery({
    admissionId: pathname.split("/")[2],
    page: 1,
    size: 5,
  });

  const { data: units, isSuccess: unitsSuccess } = useGetAllUnitsQuery({
    page: 1,
    size: 9999,
  });

  const handleTogglePage = async (page: number) => {
    setCurrentPage(page + 1);
    const { data } = await getAdmissionById(
      pathname.split("/")[2],
      page + 1,
      5,
    );

    setCandidates(data.admissionResult);
  };

  const getFilterValues = (column: string) => {
    const paramsValue = get(column);
    if (paramsValue) {
      const paramsArray = paramsValue.split(",");
      table?.getColumn(column)?.setFilterValue(paramsArray);
    }
  };

  const handleInputValue = (value: string) => {
    setGlobalFilter(value);
  };

  const columnHelper = createColumnHelper<IAdmissionCandidate>();
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
    columnHelper.accessor("candidacy.candidate.name", {
      header: "Nome",
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor(value => formatCpf(value.candidacy.candidate.cpf), {
      header: "CPF",
      cell: row => <div>{formatCpf(row.getValue())}</div>,
    }),
    columnHelper.accessor(value => formatCpf(value.candidacy.candidate.cpf), {
      header: "RG (COLOCAR O CERTO)",
      cell: row => <div>{formatCpf(row.getValue())}</div>,
    }),
    columnHelper.accessor(
      value =>
        dayjs(value.candidacy.candidate.birthdate).utc().format("DD/MM/YYYY"),
      {
        header: "Data de nascimento",
        cell: row => <div>{row.getValue()}</div>,
      },
    ),
    // columnHelper.accessor(
    //   value => formatPhoneNumber(value.candidacy.candidate.phone),
    //   {
    //     header: "Telefone",
    //     cell: row => <div>{formatPhoneNumber(row.getValue())}</div>,
    //   },
    // ),
    columnHelper.accessor("candidacy.process.unit.unitName", {
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
  ];

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
    if (isSuccess) {
      setAdmission(data.admission);
      setCandidates(data.admissionResult);
      setTotalCount(data.totalCount);
    }
  }, [isSuccess]);

  if (!admission) return;

  return (
    <div className={styles.admission}>
      <section className={styles.admission__info}>
        <p>Criado em {dayjs(admission.createdAt).format("DD/MM/YYYY HH:mm")}</p>
        <p>Por: {admission.examiner}</p>
      </section>
      <section className={styles.admission__actions}>
        <div className={styles.admission__actions__top}>
          <Button
            buttonType="secondary"
            text="Exportar dados"
            icon={<SystemUpdate />}
          />

          <SearchInput handleChangeValue={handleInputValue} icon={<Search />} />

          <div className={styles.admission__actions__top__right}>
            <Status type={admission.status} />
            <Button
              buttonType="secondary"
              text="Editar"
              icon={<EditSquare />}
            />
          </div>
        </div>
        <div className={styles.buttonContract}>
          <SaveModal
            buttonText="Permitir acesso"
            handleOnSave={() => {}}
            icon={<TaskAlt />}
            text="Liberar contratos para assinatura?"
          >
            <Button
              buttonType="primary"
              text="Liberar contratos para assinatura"
              icon={<TaskAlt />}
            />
          </SaveModal>
        </div>
      </section>

      {candidates && totalCount && (
        <DataTable
          data={candidates}
          columns={columns}
          currentPage={currentPage}
          defaultTableSize={2}
          handleTogglePage={handleTogglePage}
          setTable={setTable}
          size={totalCount}
          globalFilterValue={globalFilter}
        />
      )}
    </div>
  );
}

export function Status({ type }: { type: string }) {
  const bgColor = {
    CONCLUIDO: "var(--sucess)",
    EM_ANDAMENTO: "var(--attention)",
    EMANDAMENTO: "var(--attention)",
    "EM ANDAMENTO": "var(--attention)",
    CANCELADO: "var(--error)",
    SUSPENSO: "var(--secondary-7)",
  };

  const status =
    AdmissionsStatusEnum[type as keyof typeof AdmissionsStatusEnum];

  return (
    <div
      className={styles.status}
      style={{ background: bgColor[type as keyof typeof bgColor] }}
    >
      {status}
      <DonutLarge />
    </div>
  );
}
