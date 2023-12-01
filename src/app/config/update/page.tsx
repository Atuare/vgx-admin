"use client";
import { FileInput, IClearFileHandle } from "@/components/FileInput";
import { Select } from "@/components/Select";
import { useTableParams } from "@/hooks/useTableParams";
import { TUpdateOptions } from "@/interfaces/configUpdate.interface";
import {
  useSendEmployeeSpreadsheetMutation,
  useSendJuridicalSpreadsheetMutation,
  useSendMisSpreadsheetMutation,
  useSendShutdownSpreadsheetMutation,
} from "@/services/api/fetchApi";
import {
  configSelectOptions,
  getSpreadsheet,
  handleCheckSpreadsheetData,
  validateOption,
} from "@/utils/configUpdate";
import { Toast } from "@/utils/toast";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import styles from "./UpdateConfig.module.scss";

export default function ConfigUpdate() {
  const { get } = useSearchParams();
  const defaultOption = get("option") ? String(get("option")) : "MIS";

  const [option, setOption] = useState<TUpdateOptions>(
    validateOption(defaultOption),
  );
  const fileInputRef = useRef<IClearFileHandle>(null);

  const { setParams } = useTableParams();

  const [sendMisSpreadsheet] = useSendMisSpreadsheetMutation();
  const [sendJuridicalSpreadsheet] = useSendJuridicalSpreadsheetMutation();
  const [sendShutdownSpreadsheet] = useSendShutdownSpreadsheetMutation();
  const [sendEmployeeSpreadsheet] = useSendEmployeeSpreadsheetMutation();

  const handleGetUpdateFunction = () => {
    switch (option) {
      case "MIS":
        return sendMisSpreadsheet;
      case "Jurídico":
        return sendJuridicalSpreadsheet;
      case "Desligamentos":
        return sendShutdownSpreadsheet;
      case "Funcionários":
        return sendEmployeeSpreadsheet;
    }
  };

  const handleImportExcel = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = e => {
        const workbook = XLSX.read(e.target?.result as ArrayBuffer, {
          type: "buffer",
        });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
        });

        const spreadsheetData = handleCheckSpreadsheetData(data, option);

        if (spreadsheetData) {
          const updateFunction = handleGetUpdateFunction();

          updateFunction({ data: spreadsheetData }).then(data => {
            if ("error" in data) {
              Toast(
                "error",
                "Não foi possível atualizar os dados. Verifique se a planilha está correta.",
              );
              if (fileInputRef.current) fileInputRef.current?.handleClearFile();
            } else {
              Toast("success", "Dados atualizados com sucesso");
              if (fileInputRef.current) fileInputRef.current?.handleClearFile();
            }
          });
        } else {
          Toast("error", "Planilha inválida.");
          if (fileInputRef.current) fileInputRef.current?.handleClearFile();
        }
      };
    }
  };

  useEffect(() => {
    setParams("option", option);
  }, [option]);

  return (
    <main className={styles.config}>
      <Select
        onChange={({ id }) => setOption(id as TUpdateOptions)}
        placeholder="Selecione"
        options={configSelectOptions}
        defaultValue={option}
        maxHeight={250}
        width={296}
      />
      <FileInput
        width="390px"
        allowedTypes={["xlsx", "xls", "xltx"]}
        onChange={handleImportExcel}
        ref={fileInputRef}
      />
      <p>
        Baixe a planilha modelo, preencha e selecione o arquivo com os dados
        para importação.
      </p>
      <a href={getSpreadsheet(option)} download>
        Download planilha modelo
      </a>
      <div className={styles.config__message}>
        <strong>ATENÇÃO!</strong>
        <p>
          Deixando a opção &ldquo;Remover da Base&rdquo; da planilha sem marcar,
          você irá adicionar registros à tabela. No caso do MIS, se o registro
          ja existir (o qual deve correlacionar ao CPF e data) ele irá ser
          atualizado. Se a opção REMOVER for marcada, ele irá retirar os dados
          vinculados ao CPF da base.
          <br />
          <br />
          <strong>OBS.: </strong>Para que todos os dados da tabela modelo sejam
          importados, todos os campos devem ser preenchidos, mesmo que sejam
          dados “falsos” apenas para removê-los da base.
        </p>
      </div>
    </main>
  );
}
