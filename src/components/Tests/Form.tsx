"use client";

import { Publish, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { DataInput } from "@/components/DataInput";
import { TestCreateModal } from "@/components/Modals/TestCreateModal";
import { Select } from "@/components/Select";
import { TestsCreateTable } from "@/components/Tables/TestsCreateTable";
import { TipTap } from "@/components/TipTap";
import { QuestionTypeEnum } from "@/enums/test.enum";
import { IQuestion, ITest } from "@/interfaces/tests.interface";
import { testsCreateConfigSchema } from "@/schemas/configTestsSchema";
import { useGetAllUnitsQuery } from "@/services/api/fetchApi";
import { Toast } from "@/utils/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Table } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import { Controller, useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import styles from "./Test.module.scss";

const types = {
  Português: "PORTUGUESE",
  Matemática: "MATHEMATICS",
  Informática: "COMPUTING",
};

interface TestCreateProps {
  handleOnSubmit: (data: any) => void;
  defaultValue?: ITest;
}

export default function TestForm({
  handleOnSubmit,
  defaultValue,
}: TestCreateProps) {
  const [questions, setQuestions] = useState<IQuestion[]>(
    defaultValue?.questions ?? [],
  );
  const [table, setTable] = useState<Table<any>>();
  const [units, setUnits] = useState<any>();

  const {
    control,
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(testsCreateConfigSchema),
    defaultValues: {
      ...defaultValue,
      unitId: defaultValue?.unit?.id,
    },
  });

  const { back } = useRouter();

  const { data: unitsData, isSuccess: unitsIsSuccess } = useGetAllUnitsQuery({
    page: 1,
    size: 10000,
    orderBy: "unitName",
    direction: "ASC",
  });

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
        unitsData.units.map((value: any) => {
          return { id: value.id, name: value.unitName };
        }),
      );
  }, [unitsIsSuccess]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleOnSubmit)}>
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
                defaultValue={defaultValue?.unit?.unitName}
              />
            </DataInput>
          )}
        />
        <DataInput
          name="Tempo máx. prova"
          lightName="(minutos)"
          required
          error={errors.maxTime?.message}
        >
          <input
            type="number"
            style={{ width: 128 }}
            {...register("maxTime")}
          />
        </DataInput>
      </Container>

      <Container>
        <DataInput
          name="Total de questões português"
          required
          error={errors.portTotal?.message}
        >
          <input
            type="number"
            style={{ width: 128 }}
            {...register("portTotal")}
          />
        </DataInput>

        <DataInput
          name="Nota mín. aprovação"
          required
          error={errors.portMinScore?.message}
        >
          <input
            type="number"
            style={{ width: 128 }}
            {...register("portMinScore")}
          />
        </DataInput>

        <DataInput
          name="Total de questões matemática"
          required
          error={errors.matTotal?.message}
        >
          <input
            type="number"
            style={{ width: 128 }}
            {...register("matTotal")}
          />
        </DataInput>

        <DataInput
          name="Nota mín. aprovação"
          required
          error={errors.matMinScore?.message}
        >
          <input
            type="number"
            style={{ width: 128 }}
            {...register("matMinScore")}
          />
        </DataInput>
      </Container>

      <Container>
        <DataInput
          name="Total de questões noções informática"
          required
          error={errors.compTotal?.message}
        >
          <input
            type="number"
            style={{ width: 128 }}
            {...register("compTotal")}
          />
        </DataInput>

        <DataInput
          name="Nota mín. aprovação"
          required
          error={errors.compMinScore?.message}
        >
          <input
            type="number"
            style={{ width: 128 }}
            {...register("compMinScore")}
          />
        </DataInput>
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
        render={({ field: { onChange }, fieldState: { error } }) => (
          <div>
            <TestsCreateTable
              setTable={setTable}
              questions={questions}
              handleSetQuestions={questions => {
                setQuestions(questions);
                onChange(questions);
              }}
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
                } else {
                  onChange("");
                }
              }}
              content={
                defaultValue && JSON.parse(defaultValue?.orientationMessage)
              }
              grayBorder
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
                } else {
                  onChange("");
                }
              }}
              content={defaultValue && JSON.parse(defaultValue?.aproveMessage)}
              grayBorder
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
                } else {
                  onChange("");
                }
              }}
              content={
                defaultValue && JSON.parse(defaultValue?.disapprovedMessage)
              }
              grayBorder
            />
            <p className={styles.error}>{error?.message}</p>
          </div>
        )}
      />

      <div className={styles.form__buttons}>
        <Button
          buttonType="default"
          text="Cancelar"
          type="button"
          onClick={() => back()}
        />
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
