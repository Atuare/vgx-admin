"use client";
import { FileInput } from "@/components/FileInput";
import { Select } from "@/components/Select";
import { configSelectOptions } from "@/utils/configUpdate";
import { useState } from "react";
import styles from "./UpdateConfig.module.scss";

export default function ConfigUpdate() {
  const [option, setOption] = useState("MIS");

  const getSpreadsheet = () => {
    switch (option) {
      case "MIS":
        return "/spreadsheets/excel-mis.xlsx";
      case "Jurídico":
        return "/spreadsheets/excel-juridico.xlsx";
      case "Funcionários":
        return "/spreadsheets/excel-funcionarios.xlsx";
      case "Desligamentos":
        return "/spreadsheets/excel-desligamento.xlsx";
    }
  };

  return (
    <main className={styles.config}>
      <Select
        onChange={({ id }) => setOption(id)}
        placeholder="Selecione"
        options={configSelectOptions}
        defaultValue="MIS"
        maxHeight={250}
        width={296}
      />
      <FileInput width="390px" />
      <p>
        Baixe a planilha modelo, preencha e selecione o arquivo com os dados
        para importação.
      </p>
      <a href={getSpreadsheet()} download>
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
