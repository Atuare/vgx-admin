"use client";

import { Publish, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { DataInput } from "@/components/DataInput";
import { TestCreateModal } from "@/components/Modals/TestCreateModal";
import { Select } from "@/components/Select";
import { TestsCreateTable } from "@/components/Tables/TestsCreateTable";
import { TipTap } from "@/components/TipTap";
import { QuestionTypeEnum } from "@/enums/test.enum";
import { IQuestion } from "@/interfaces/tests.interface";
import { testsCreateConfigSchema } from "@/schemas/configTestsSchema";
import {
  useCreateTestMutation,
  useGetAllUnitsQuery,
} from "@/services/api/fetchApi";
import { Toast } from "@/utils/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Table } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import { Controller, useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import styles from "./TestCreate.module.scss";

const types = {
  Português: "PORTUGUESE",
  Matemática: "MATHEMATICS",
  Informática: "COMPUTING",
};

export default function TestCreate() {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [table, setTable] = useState<Table<any>>();
  const [units, setUnits] = useState<any>();

  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(testsCreateConfigSchema),
  });

  const { push } = useRouter();

  const [createTest] = useCreateTestMutation();
  const { data: unitsData, isSuccess: unitsIsSuccess } = useGetAllUnitsQuery({
    page: 1,
    size: 1000,
    orderBy: "unitName",
    direction: "ASC",
  });

  const handleCreateTest = (data: any) => {
    createTest(data)
      .then(() => {
        Toast("success", "Prova criada com sucesso!");
        push("/config/tests");
      })
      .catch(() => {
        Toast("error", "Não foi possível criar a prova.");
      });
  };

  const handleCreateQuestion = (data: any) => {
    const newQuestions = [...questions, data];
    setQuestions(newQuestions);
    Toast("success", "Questão criada com sucesso!");
  };

  const downloadTableExcelHandler = () => {
    const columnHeaders = ["Número", "Texto", "Tipo"];

    const rows = table?.getRowModel().flatRows.map(row => row.original);

    if (rows && rows.length > 0) {
      const excelData = rows.map((row, index) => ({
        number: `Questão ${index + 1}`,
        text: row.text,
        type: QuestionTypeEnum[row.type as keyof typeof QuestionTypeEnum],
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
            const newQuestion: IQuestion = {
              text: row.QUESTION,
              type: types[row.TYPE as keyof typeof types],
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

  useEffect(() => {
    setValue("questions", questions);
  }, [questions]);

  useEffect(() => {
    unitsIsSuccess &&
      setUnits(
        unitsData.units.map(value => {
          return { id: value.id, name: value.unitName };
        }),
      );
  }, [unitsIsSuccess]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleCreateTest)}>
      <h3 className={styles.form__title}>Dados prova</h3>
      <Container>
        <Controller
          control={control}
          name="unitId"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <DataInput
              name="Unidade/Site"
              required
              width="296px"
              error={error?.message}
            >
              <Select
                onChange={({ id }) => onChange(id)}
                options={units ?? []}
                placeholder="Selecione"
              />
            </DataInput>
          )}
        />
        <Controller
          control={control}
          name="maxTime"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <DataInput
              name="Tempo máx. prova"
              lightName="(minutos)"
              required
              error={error?.message}
            >
              <input
                type="text"
                pattern="\d*"
                onChange={e => {
                  if (!e.target.validity.valid) {
                    e.target.value = "";
                    return;
                  }
                  onChange(e.target.value);
                }}
                style={{ width: 128 }}
              />
            </DataInput>
          )}
        />
      </Container>

      <Container>
        <Controller
          control={control}
          name="portTotal"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <DataInput
              name="Total de questões português"
              required
              error={error?.message}
            >
              <input
                type="text"
                pattern="\d*"
                onChange={e => {
                  if (!e.target.validity.valid) {
                    e.target.value = "";
                    return;
                  }
                  onChange(e.target.value);
                }}
                style={{ width: 128 }}
              />
            </DataInput>
          )}
        />

        <Controller
          control={control}
          name="portMinScore"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <DataInput
              name="Nota mín. aprovação"
              required
              error={error?.message}
            >
              <input
                type="text"
                pattern="\d*"
                onChange={e => {
                  if (!e.target.validity.valid) {
                    e.target.value = "";
                    return;
                  }
                  onChange(e.target.value);
                }}
                style={{ width: 128 }}
              />
            </DataInput>
          )}
        />

        <Controller
          control={control}
          name="matTotal"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <DataInput
              name="Total de questões matemática"
              required
              error={error?.message}
            >
              <input
                type="text"
                pattern="\d*"
                onChange={e => {
                  if (!e.target.validity.valid) {
                    e.target.value = "";
                    return;
                  }
                  onChange(e.target.value);
                }}
                style={{ width: 128 }}
              />
            </DataInput>
          )}
        />

        <Controller
          control={control}
          name="matMinScore"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <DataInput
              name="Nota mín. aprovação"
              required
              error={error?.message}
            >
              <input
                type="text"
                pattern="\d*"
                onChange={e => {
                  if (!e.target.validity.valid) {
                    e.target.value = "";
                    return;
                  }
                  onChange(e.target.value);
                }}
                style={{ width: 128 }}
              />
            </DataInput>
          )}
        />
      </Container>

      <Container>
        <Controller
          control={control}
          name="compTotal"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <DataInput
              name="Total de questões noções informática"
              required
              error={error?.message}
            >
              <input
                type="text"
                pattern="\d*"
                onChange={e => {
                  if (!e.target.validity.valid) {
                    e.target.value = "";
                    return;
                  }
                  onChange(e.target.value);
                }}
                style={{ width: 128 }}
              />
            </DataInput>
          )}
        />

        <Controller
          control={control}
          name="compMinScore"
          render={({ field: { onChange }, fieldState: { error } }) => (
            <DataInput
              name="Nota mín. aprovação"
              required
              error={error?.message}
            >
              <input
                type="text"
                pattern="\d*"
                onChange={e => {
                  if (!e.target.validity.valid) {
                    e.target.value = "";
                    return;
                  }
                  onChange(e.target.value);
                }}
                style={{ width: 128 }}
              />
            </DataInput>
          )}
        />
      </Container>

      <h3 className={styles.form__title}>Questões prova</h3>

      <div className={styles.form__actions}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
          type="button"
          onClick={downloadTableExcelHandler}
        />

        <div className={styles.form__actions__right}>
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

          <TestCreateModal handleOnSubmit={handleCreateQuestion} create />
        </div>
      </div>

      <Controller
        control={control}
        name="questions"
        render={({ fieldState: { error } }) => (
          <div>
            <TestsCreateTable
              setTable={setTable}
              questions={questions}
              handleSetQuestions={setQuestions}
            />
            <p className={styles.error}>{error?.message}</p>
          </div>
        )}
      />

      <h3 className={styles.form__title}>Orientação para a prova</h3>
      <Controller
        control={control}
        name="orientationMessage"
        render={({ field: { onChange }, fieldState: { error } }) => (
          <div>
            <TipTap
              getContentFromEditor={content => {
                if (content.content[0].content) {
                  onChange(JSON.stringify(content));
                }
              }}
            />
            <p className={styles.error}>{error?.message}</p>
          </div>
        )}
      />

      <h3 className={styles.form__title}>Mensagem final</h3>
      <h4 className={styles.form__subtitle}>Aprovação*</h4>
      <Controller
        control={control}
        name="aproveMessage"
        render={({ field: { onChange }, fieldState: { error } }) => (
          <div>
            <TipTap
              getContentFromEditor={content => {
                if (content.content[0].content) {
                  onChange(JSON.stringify(content));
                }
              }}
            />
            <p className={styles.error}>{error?.message}</p>
          </div>
        )}
      />

      <h4 className={styles.form__subtitle}>Reprovação*</h4>
      <Controller
        control={control}
        name="disapprovedMessage"
        render={({ field: { onChange }, fieldState: { error } }) => (
          <div>
            <TipTap
              getContentFromEditor={content => {
                if (content.content[0].content) {
                  onChange(JSON.stringify(content));
                }
              }}
            />
            <p className={styles.error}>{error?.message}</p>
          </div>
        )}
      />

      <div className={styles.form__buttons}>
        <Button buttonType="default" text="Cancelar" />
        <Button buttonType="primary" text="Salvar" />
      </div>
    </form>
  );
}

function Container({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
      {children}
    </div>
  );
}
