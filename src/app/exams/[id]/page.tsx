"use client";

import { EditSquare, Search, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/SearchInput";
import { Status } from "@/components/Status";
import { ExamDetailsTable } from "@/components/Tables/ExamDetailsTable";
import {
  useGetExamByIdQuery,
  useUpdateExamStatusMutation,
} from "@/services/api/fetchApi";
import { Table } from "@tanstack/react-table";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { TrainingStatusModal } from "@/components/Modals/TrainingStatusModal";
import { ExamsStatusEnum } from "@/enums/status.enum";
import { setExam } from "@/features/exam/examSlice";
import { downloadExcel } from "react-export-table-to-excel";
import { useDispatch } from "react-redux";
import styles from "./ExamDetails.module.scss";

const defaultTableSize = 5;

export default function ExamDetail() {
  const [examClass, setExamClass] = useState<any>();
  const { push } = useRouter();
  const dispatch = useDispatch();

  const pathname = usePathname();
  const examId = pathname.split("/")[2];

  const { data, isFetching, isSuccess, refetch } = useGetExamByIdQuery({
    id: examId,
  });

  const [updateExamStatus] = useUpdateExamStatusMutation();

  const [globalFilter, setGlobalFilter] = useState("");
  const [table, setTable] = useState<Table<any>>();

  const handleEditExam = () => {
    push(`/exams/${examId}/edit`);
  };

  const downloadTableExcelHandler = () => {
    const selectedRows = table
      ?.getSelectedRowModel()
      .flatRows.map(row => row.original);

    const columnHeaders = [
      "Nome",
      "CPF",
      "RG",
      "Data de nascimento",
      "Idade",
      "Função",
      "Status doc.",
      "Unidade/Site",
      "Produto",
      "Telefone",
      "Status",
    ];

    if (selectedRows && selectedRows.length > 0) {
      const excelData = selectedRows.map(row => ({
        name: row.candidate.name,
        cpf: row.candidate.cpf,
        rg: row.candidate.documents.identity.rg,
        birthdate: dayjs(row.candidate.birthdate).utc().format("DD/MM/YYYY"),
        age: dayjs(row.candidate.birthdate).utc().format("YY"),
        role: row.process.role.roleText,
        statusDoc: row.status,
        unit: row.process.unit.unitName,
        productName: row.training.productName,
        phone: row.candidate.phone,
        status: row.examStatus,
      }));

      downloadExcel({
        fileName: `Exame turma`,
        sheet: `Exame turma`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    } else {
      const rows = table?.getRowModel().flatRows.map(row => row.original);

      if (rows && rows.length > 0) {
        const excelData = rows.map(row => ({
          name: row.candidate.name,
          cpf: row.candidate.cpf,
          rg: row.candidate.documents.identity.rg,
          birthdate: dayjs(row.candidate.birthdate).utc().format("DD/MM/YYYY"),
          age: dayjs(row.candidate.birthdate).utc().format("YY"),
          role: row.process.role.roleText,
          statusDoc: row.status,
          unit: row.process.unit.unitName,
          productName: row.training.productName,
          phone: row.candidate.phone,
          status: row.examStatus,
        }));

        downloadExcel({
          fileName: `Exame turma`,
          sheet: `Exame turma`,
          tablePayload: {
            header: columnHeaders,
            body: excelData,
          },
        });
      }
    }
  };

  useEffect(() => {
    isSuccess && setExamClass(data?.data);
    dispatch(setExam(data?.data));
  }, [isSuccess, isFetching]);

  const handleUpdateExamStatus = (data: any) => {
    const status =
      Object.keys(ExamsStatusEnum)[
        Object.values(ExamsStatusEnum).indexOf(data.status)
      ];

    updateExamStatus({
      examId: examId,
      data: {
        status: status,
        reason: data.reason,
      },
    }).then(() => {
      refetch();
    });
  };

  return (
    <main className={styles.examDetails}>
      <header className={styles.examDetails__header}>
        <div className={styles.examDetails__header__info}>
          <p>
            Criado em {dayjs(examClass?.createdAt).format("DD/MM/YYYY HH:mm")}
          </p>
          <p>Por: {examClass?.examiner}</p>
        </div>
      </header>
      <section className={styles.examDetails__actions}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
          onClick={downloadTableExcelHandler}
        />

        <SearchInput handleChangeValue={setGlobalFilter} icon={<Search />} />

        <div className={styles.examDetails__actions__groupSection}>
          <TrainingStatusModal handleOnSubmit={handleUpdateExamStatus}>
            <Status type={examClass?.status} pointer />
          </TrainingStatusModal>
          <Button
            buttonType="secondary"
            text="Editar"
            icon={<EditSquare />}
            onClick={handleEditExam}
          />
        </div>
      </section>

      <ExamDetailsTable
        defaultTableSize={defaultTableSize}
        setTable={setTable}
        table={table}
        globalFilter={globalFilter}
        examId={examId}
      />
    </main>
  );
}
