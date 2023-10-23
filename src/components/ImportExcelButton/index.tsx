import { Publish } from "@/assets/Icons";
import { Toast } from "@/utils/toast";
import { ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { Button } from "../Button";

interface IImportExcelButtonProps {
  handleOnImportExcel: (data: any) => void;
}

export function ImportExcelButton({
  handleOnImportExcel,
}: IImportExcelButtonProps) {
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
          const data = XLSX.utils.sheet_to_json(worksheet, {
            rawNumbers: false,
          });

          event.target.value = "";
          handleOnImportExcel(data);
        };
      } else {
        Toast("error", "Formato de arquivo inválido.");
        event.target.value = "";
      }
    }
  };

  return (
    <>
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
    </>
  );
}
