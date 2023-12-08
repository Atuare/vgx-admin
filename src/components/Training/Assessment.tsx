"use client";
import { ChevronDown, Publish, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { DataInput } from "@/components/DataInput";
import { TrainingCreateModal } from "@/components/Modals/TrainingCreateModal";
import { TrainingCreateTable } from "@/components/Tables/TrainingCreateTable";
import { TipTap } from "@/components/TipTap";
import {
  IQuestion,
  ITrainingCreateForm,
} from "@/interfaces/training.interface";
import { Toast } from "@/utils/toast";
import * as Accordion from "@radix-ui/react-accordion";
import { Table } from "@tanstack/react-table";
import { ChangeEvent, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFormRegister,
  UseFormTrigger,
} from "react-hook-form";
import * as XLSX from "xlsx";
import styles from "./TrainingCreate.module.scss";

interface AssessmentProps {
  questionNumber: number;
  register: UseFormRegister<ITrainingCreateForm>;
  control: Control<ITrainingCreateForm>;
  errors: FieldErrors<ITrainingCreateForm>;
  index: number;
  field: FieldArrayWithId<ITrainingCreateForm, "trainingAssessments", "id">;
  trigger: UseFormTrigger<ITrainingCreateForm>;
}

const defaultTableSize = 15;

export function Assessment({
  questionNumber,
  field,
  control,
  errors,
  register,
  trigger,
  index,
}: AssessmentProps) {
  const [questions, setQuestions] = useState<Partial<IQuestion>[]>(
    field.trainingAssessmentQuestions,
  );
  const [table, setTable] = useState<Table<any>>();

  const handleCreateQuestion = (data: any) => {
    const newQuestions = [
      ...questions,
      {
        ...data,
        number: questions.length,
      },
    ];

    return newQuestions;
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
              question: row.QUESTION,
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
            const newQuestions = handleCreateQuestion(newQuestion);
            setQuestions(newQuestions);
            trigger(`trainingAssessments.${index}.trainingAssessmentQuestions`);
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
                disabled={questions?.length === 0}
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
                  onChange={event => {
                    handleImportExcel(event);
                  }}
                />

                <Controller
                  control={control}
                  name={`trainingAssessments.${index}.trainingAssessmentQuestions`}
                  render={({ field: { onChange } }) => (
                    <TrainingCreateModal
                      handleOnSubmit={data => {
                        const newQuestions = handleCreateQuestion(data);
                        setQuestions(newQuestions);
                        Toast("success", "Questão criada com sucesso!");
                        onChange(newQuestions);
                      }}
                      create
                    />
                  )}
                />
              </div>
            </div>
            <div className={styles.accordion__content__inputs}>
              <DataInput
                name="Total de questões"
                required
                error={
                  errors.trainingAssessments?.[index]?.questionsAmount?.message
                }
              >
                <input
                  type="number"
                  defaultValue={field.questionsAmount}
                  {...register(`trainingAssessments.${index}.questionsAmount`)}
                />
              </DataInput>

              <DataInput
                name="Nota mín. aprovação"
                required
                error={
                  errors.trainingAssessments?.[index]?.minimumPassingGrade
                    ?.message
                }
              >
                <input
                  type="number"
                  defaultValue={field.minimumPassingGrade}
                  {...register(
                    `trainingAssessments.${index}.minimumPassingGrade`,
                  )}
                />
              </DataInput>

              <DataInput
                name="Tempo máx. prova"
                required
                lightName="(minutos)"
                error={
                  errors.trainingAssessments?.[index]?.maxTimeToFinish?.message
                }
              >
                <input
                  type="number"
                  defaultValue={field.maxTimeToFinish}
                  {...register(`trainingAssessments.${index}.maxTimeToFinish`)}
                />
              </DataInput>
            </div>

            <Controller
              control={control}
              name={`trainingAssessments.${index}.trainingAssessmentQuestions`}
              render={({ field: { onChange }, fieldState: { error } }) => (
                <div>
                  <TrainingCreateTable
                    handleSetQuestions={questions => {
                      setQuestions(questions);
                      onChange(questions);
                    }}
                    questions={questions}
                    setTable={setTable}
                    defaultTableSize={defaultTableSize}
                  />
                  <p className={styles.error}>{error?.message}</p>
                </div>
              )}
            />

            <section className={styles.accordion__content__orientation}>
              <h2>Orientação para a prova</h2>
              <Controller
                control={control}
                name={`trainingAssessments.${index}.orientationMessage`}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <div>
                    <TipTap
                      grayBorder
                      content={value ? JSON.parse(value) : ""}
                      getContentFromEditor={content => {
                        if (
                          content.content.some(
                            (item: { content: any }) => item?.content,
                          ) &&
                          content.content.some(
                            (item: { content: any[] }) =>
                              item.content?.every(
                                subItem =>
                                  subItem.text &&
                                  typeof subItem.text === "string" &&
                                  subItem.text.trim() !== "",
                              ),
                          )
                        ) {
                          onChange(JSON.stringify(content));
                        } else {
                          onChange("");
                        }
                      }}
                    />
                    <p className={styles.error}>{error?.message}</p>
                  </div>
                )}
              />
            </section>
            <section className={styles.accordion__content__messages}>
              <h2>Mensagem final</h2>
              <div className={styles.accordion__content__messages_container}>
                <h3>Aprovação*</h3>
                <Controller
                  control={control}
                  name={`trainingAssessments.${index}.approvedMessage`}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <div>
                      <TipTap
                        grayBorder
                        content={value ? JSON.parse(value) : ""}
                        getContentFromEditor={content => {
                          if (
                            content.content.some(
                              (item: { content: any }) => item?.content,
                            ) &&
                            content.content.some(
                              (item: { content: any[] }) =>
                                item.content?.every(
                                  subItem =>
                                    subItem.text &&
                                    typeof subItem.text === "string" &&
                                    subItem.text.trim() !== "",
                                ),
                            )
                          ) {
                            onChange(JSON.stringify(content));
                          } else {
                            onChange("");
                          }
                        }}
                      />
                      <p className={styles.error}>{error?.message}</p>
                    </div>
                  )}
                />
              </div>
              <div className={styles.accordion__content__messages_container}>
                <h3>Reprovação*</h3>
                <Controller
                  control={control}
                  name={`trainingAssessments.${index}.disapprovedMessage`}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => {
                    return (
                      <div>
                        <TipTap
                          grayBorder
                          content={value ? JSON.parse(value) : ""}
                          getContentFromEditor={content => {
                            if (
                              content.content.some(
                                (item: { content: any }) => item?.content,
                              ) &&
                              content.content.some(
                                (item: { content: any[] }) =>
                                  item.content?.every(
                                    subItem =>
                                      subItem.text &&
                                      typeof subItem.text === "string" &&
                                      subItem.text.trim() !== "",
                                  ),
                              )
                            ) {
                              onChange(JSON.stringify(content));
                            } else {
                              onChange("");
                            }
                          }}
                        />
                        <p className={styles.error}>{error?.message}</p>
                      </div>
                    );
                  }}
                />
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
