"use client";
import {
  fetchApi,
  useDeleteProcessMutation,
  useGetAllProcessQuery,
  useGetProcessCandidatesQuery,
} from "@/services/api/fetchApi";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./ProcessData.module.scss";

import { Delete, EditSquare, Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import { setProcessEdit } from "@/features/process/processEditSlice";
import { ProcessType } from "@/interfaces/process.interface";

import { Checkbox } from "@/components/Checkbox";
import { DataInput } from "@/components/DataInput";
import { DeleteModal } from "@/components/DeleteModal";
import { Input } from "@/components/Input";
import { Radio } from "@/components/Radio";
import { DataTable } from "@/components/Table";
import { useTableParams } from "@/hooks/useTableParams";
import { IProcessCandidacy } from "@/interfaces/processCandidacy.interface";
import { formatCpf } from "@/utils/formatCpf";
import { formatTimeRange } from "@/utils/formatTimeRange";
import {
  formatPhoneNumber,
  formatWhatsappNumber,
} from "@/utils/phoneFormating";
import { Table, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { downloadExcel } from "react-export-table-to-excel";
dayjs.extend(utc);

export default function ProcessData() {
  const { data, isSuccess } = useGetAllProcessQuery({
    page: 1,
    size: 1,
  });

  const [deleteProcess] = useDeleteProcessMutation();
  const dispatch = useDispatch();
  const [process, setProcess] = useState<ProcessType>();
  const [table, setTable] = useState<Table<any>>();
  const [totalCount, setTotalCount] = useState<number>();
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const params = useParams();
  const { push } = useRouter();
  const { get } = useSearchParams();
  const { setParams } = useTableParams();

  const [currentPage, setCurrentPage] = useState<number>(
    get("page") ? Number(get("page")) : 1,
  );

  const { data: candidatesData, isSuccess: candidatesSuccess } =
    useGetProcessCandidatesQuery({
      id: Array.from(params.id).join(""),
    });

  function handleInputValue(value: string) {
    setGlobalFilter(value);
  }

  function handleDeleteProcess() {
    const processId = Array.from(params.id).join("");

    deleteProcess({ id: processId }).then(() => {
      location.replace("/process");
    });
  }

  async function handleGetProcess() {
    const totalCount = data.totalCount;

    const { data: processesData } = await dispatch<any>(
      fetchApi.endpoints.getAllProcess.initiate({ page: 1, size: totalCount }),
    );

    processesData.processes.map((process: ProcessType) => {
      if (String(process.id) === params.id) {
        setProcess(process);
        dispatch(setProcessEdit(process));
      }
    });
  }

  function handleEditProcess() {
    push(`/process/${process?.id}/edit`);
  }

  const handleTogglePage = (page: number) => {
    setCurrentPage(page + 1);
  };

  const columnHelper = createColumnHelper<IProcessCandidacy>();

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
    columnHelper.accessor(value => formatCpf(value.cpf), {
      header: "CPF",
      cell: row => (
        <div style={{ paddingLeft: 0 }}>{formatCpf(row.getValue())}</div>
      ),
    }),
    columnHelper.accessor("name", {
      header: "Nome",
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor(value => formatWhatsappNumber(value.whatsapp), {
      header: "Whatsapp",
      cell: row => <div>{formatWhatsappNumber(row.getValue())}</div>,
    }),
    columnHelper.accessor("role", {
      header: "Vaga",
      cell: row => <div>{row.getValue()}</div>,
    }),
    columnHelper.accessor("availabilities", {
      header: "Disponibilidade",
      cell: row => {
        const values = row.getValue().split(", ");

        return (
          <div
            style={{
              margin: "0 auto",
              maxWidth: "192px",
              maxHeight: "42px",
              overflowY: "scroll",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {values.map(value => (
              <p key={crypto.randomUUID()}>{value}</p>
            ))}
          </div>
        );
      },
    }),
    columnHelper.accessor("unit", {
      header: "Unidade",
      cell: row => <div>{row.getValue()}</div>,
    }),
  ];

  function downloadTableExcelHandler() {
    const selectedRows = table
      ?.getSelectedRowModel()
      .flatRows.map(row => row.original);

    const columnHeaders = ["CPF", "Nome", "Whatsapp"];

    if (selectedRows && selectedRows.length > 0) {
      const excelData = selectedRows.map(row => ({
        cpf: formatCpf(row.candidate.cpf),
        name: row.candidate.name,
        whatsapp: formatPhoneNumber(row.candidate.whatsapp),
      }));

      downloadExcel({
        fileName: `Processo`,
        sheet: `Processo pag. ${currentPage}`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    } else {
      const rows = table?.getRowModel().flatRows.map(row => row.original);

      if (rows && rows.length > 0) {
        const excelData = rows.map(row => ({
          cpf: formatCpf(row.candidate.cpf),
          name: row.candidate.name,
          whatsapp: formatPhoneNumber(row.candidate.whatsapp),
        }));

        downloadExcel({
          fileName: `Processo`,
          sheet: `Processo pag. ${currentPage}`,
          tablePayload: {
            header: columnHeaders,
            body: excelData,
          },
        });
      }
    }
  }

  useEffect(() => {
    if (isSuccess) {
      handleGetProcess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    setTotalCount(candidatesData?.data.candidacy.length);
  }, [candidatesSuccess]);

  useEffect(() => {
    setParams("page", String(currentPage));
  }, [currentPage]);

  if (!process) return;

  if (!candidatesData) return;

  const tableData: IProcessCandidacy[] = [];
  candidatesData?.data.candidacy.map((item: any) => {
    const texts: string[] = [];

    process.availabilities.map(availability => {
      const text = formatTimeRange(availability);
      texts.push(text);
    });

    const availabilities = texts.join(", ");

    tableData.push({
      id: item.candidate.id,
      cpf: item.candidate.cpf,
      name: item.candidate.name,
      whatsapp: item.candidate.whatsapp,
      role: process.role.roleText,
      availabilities: availabilities,
      unit: process.unit.unitName,
    });
  });

  return (
    <div className={styles.process}>
      <section className={styles.process__process}>
        <div>
          <h1>{process?.role.roleText}</h1>
          <div className={styles.buttonContainer}>
            <DeleteModal
              handleOnDelete={handleDeleteProcess}
              name="este processo"
            >
              <Button
                text="Excluir processo"
                buttonType="error"
                icon={<Delete />}
              />
            </DeleteModal>
            <Button
              text="Editar"
              buttonType="secondary"
              icon={<EditSquare />}
              onClick={handleEditProcess}
            />
          </div>
        </div>
        <p>
          Criado em {dayjs(process?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
        </p>
      </section>

      <section className={styles.process__data}>
        <DataInput name="Unidade/Site">
          <Input defaultValue={process.unit.unitName} disabled height={40} />
        </DataInput>

        <DataInput name="Cargo">
          <Input defaultValue={process.role.roleText} disabled height={40} />
        </DataInput>

        <DataInput name="Processo para">
          <Input
            defaultValue={
              process.availableForMinors
                ? "Maiores de 18 anos"
                : "Todas as idades"
            }
            disabled
            height={40}
          />
        </DataInput>

        <DataInput name="Tipo de processo" required>
          <Input defaultValue={process.type} height={40} disabled />
        </DataInput>

        <DataInput name="Data início" required>
          <Input
            defaultValue={dayjs(process.startDate).utc().format("DD/MM/YYYY")}
            height={40}
            disabled
          />
        </DataInput>

        <DataInput name="Inscrição até">
          <Input
            defaultValue={dayjs(process.endDate).utc().format("DD/MM/YYYY")}
            disabled
            height={40}
          />
        </DataInput>

        <DataInput name="Lim. Candidaturas" required>
          <Input
            defaultValue={process.limitCandidates.toString()}
            disabled
            height={40}
          />
        </DataInput>

        <DataInput name="Solicitar Currículo" required>
          <Radio defaultValue={process.requestCv} disabled />
        </DataInput>

        <DataInput name="Banner vaga" required>
          <Input
            defaultValue={process.banner ?? "Não possui"}
            disabled
            height={40}
          />
        </DataInput>
      </section>

      <section className={styles.process__actions}>
        <h1>Candidaturas</h1>
        {tableData ? (
          <div>
            <Button
              text="Exportar dados"
              buttonType="secondary"
              icon={<SystemUpdate />}
              onClick={downloadTableExcelHandler}
            />
            <SearchInput
              handleChangeValue={handleInputValue}
              icon={<Search />}
            />
          </div>
        ) : (
          <div style={{ margin: "0 auto" }}>
            Não há candidaturas para este processo.
          </div>
        )}
      </section>

      {candidatesData && totalCount && (
        <section className={styles.process__candidacyList}>
          <DataTable
            currentPage={currentPage}
            defaultTableSize={2}
            setTable={setTable}
            handleTogglePage={handleTogglePage}
            columns={columns}
            data={tableData}
            size={totalCount}
            globalFilterValue={globalFilter}
            manualPagination
          />
        </section>
      )}
    </div>
  );
}
