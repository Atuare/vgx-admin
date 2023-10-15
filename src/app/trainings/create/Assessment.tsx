"use client";
import { ChevronDown, Publish, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { DataInput } from "@/components/DataInput";
import { TrainingCreateModal } from "@/components/Modals/TrainingCreateModal";
import { TrainingCreateTable } from "@/components/Tables/TrainingCreateTable";
import { TipTap } from "@/components/TipTap";
import { IQuestion } from "@/interfaces/tests.interface";
import { Toast } from "@/utils/toast";
import * as Accordion from "@radix-ui/react-accordion";
import { Table } from "@tanstack/react-table";
import { ChangeEvent, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import * as XLSX from "xlsx";
import styles from "./TrainingCreate.module.scss";

interface AssessmentProps {
  questionNumber: number;
}

const defaultTableSize = 5;

export function Assessment({ questionNumber }: AssessmentProps) {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [table, setTable] = useState<Table<any>>();

  const handleCreateQuestion = (data: any) => {
    const newQuestions = [
      ...questions,
      {
        ...data,
        index: questions.length + 1,
      },
    ];
    setQuestions(newQuestions);
    Toast("success", "Questão criada com sucesso!");
  };

  const downloadTableExcelHandler = () => {
    const columnHeaders = ["Número", "Texto"];

    const rows = table?.getRowModel().flatRows.map(row => row.original);

    if (rows && rows.length > 0) {
      const excelData = rows.map((row, index) => ({
        number: `Questão ${index + 1}`,
        text: row.text,
      }));

      downloadExcel({
        fileName: `Questões prova`,
        sheet: `Questões prova`,
        tablePayload: {
          header: columnHeaders,
          body: excelData,
        },
      });
    }
  };

  const handleImportExcel = (event: ChangeEvent<HTMLInputElement>) => {
    const allowedExtensions = [".xls", ".xlsx"];
    const selectedFile = event?.target?.files?.[0];

    if (selectedFile) {
      const fileName = selectedFile.name;
      const fileExtension = fileName.substring(fileName.lastIndexOf("."));
      if (allowedExtensions.includes(fileExtension.toLowerCase())) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = e => {
          const workbook = XLSX.read(e.target?.result, { type: "buffer" });
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);

          data.map((row: any) => {
            const newQuestion: Partial<IQuestion> = {
              text: row.QUESTION,
              alternatives: [
                {
                  alternative: row.FIRST_OPTION,
                  isCorrect: row.CORRECT_OPTION === 1,
                },
                {
                  alternative: row.SECOND_OPTION,
                  isCorrect: row.CORRECT_OPTION === 2,
                },
                {
                  alternative: row.THIRD_OPTION,
                  isCorrect: row.CORRECT_OPTION === 3,
                },
                {
                  alternative: row.FOURTH_OPTION,
                  isCorrect: row.CORRECT_OPTION === 4,
                },
              ],
            };
            handleCreateQuestion(newQuestion);
          });
        };
      } else {
        Toast("error", "Formato de arquivo inválido.");
      }
    }
  };

  return (
    <section className={styles.accordion__container}>
      <Accordion.Item
        value={`questão-${questionNumber}`}
        style={{ overflow: "hidden" }}
      >
        <AccordionHeader questionNumber={questionNumber} />
        <Accordion.Content className={styles.accordion__contentContainer}>
          <div className={styles.accordion__content}>
            <div className={styles.accordion__content__actions}>
              <Button
                buttonType="secondary"
                text="Exportar dados"
                icon={<SystemUpdate />}
                type="button"
                onClick={downloadTableExcelHandler}
                disabled={questions.length === 0}
              />
              <div>
                <label htmlFor="uploadExcelFile" style={{ cursor: "pointer" }}>
                  <Button
                    buttonType="warning"
                    text="Importar dados"
                    icon={<Publish />}
                    type="button"
                    style={{ pointerEvents: "none" }}
                  />
                </label>

                <input
                  type="file"
                  id="uploadExcelFile"
                  style={{ display: "none" }}
                  onChange={handleImportExcel}
                  accept=".xls, .xlsx"
                />

                <TrainingCreateModal
                  handleOnSubmit={handleCreateQuestion}
                  create
                />
              </div>
            </div>
            <div className={styles.accordion__content__inputs}>
              <DataInput name="Total de questões" required>
                <input type="number" />
              </DataInput>

              <DataInput name="Nota mín. aprovação" required>
                <input type="number" />
              </DataInput>

              <DataInput name="Tempo máx. prova" required lightName="(minutos)">
                <input type="number" />
              </DataInput>
            </div>

            <TrainingCreateTable
              handleSetQuestions={setQuestions}
              questions={questions}
              setTable={setTable}
              defaultTableSize={defaultTableSize}
            />

            <section className={styles.accordion__content__orientation}>
              <h2>Orientação para a prova</h2>
              <TipTap grayBorder />
            </section>
            <section className={styles.accordion__content__messages}>
              <h2>Mensagem final</h2>
              <div className={styles.accordion__content__messages_container}>
                <h3>Aprovação*</h3>
                <TipTap grayBorder />
              </div>
              <div className={styles.accordion__content__messages_container}>
                <h3>Reprovação*</h3>
                <TipTap grayBorder />
              </div>
            </section>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </section>
  );
}

export function AccordionHeader({
  questionNumber,
}: {
  questionNumber: number;
}) {
  return (
    <Accordion.Header>
      <Accordion.Trigger className={styles.accordion__trigger}>
        <h2>
          AVALIAÇÃO{" "}
          {questionNumber < 10 ? `0${questionNumber}` : questionNumber}
        </h2>
        <ChevronDown />
      </Accordion.Trigger>
    </Accordion.Header>
  );
}
