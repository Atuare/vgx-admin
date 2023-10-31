import {
  ICPFData,
  IMISData,
  IShutdownData,
  TUpdateOptions,
} from "@/interfaces/configUpdate.interface";
import dayjs from "dayjs";

const validOptions = ["MIS", "Jurídico", "Funcionários", "Desligamentos"];

export const configSelectOptions = [
  {
    name: "MIS",
    id: "MIS",
  },
  {
    name: "Jurídico",
    id: "Jurídico",
  },
  {
    name: "Desligamentos",
    id: "Desligamentos",
  },
  {
    name: "Funcionários",
    id: "Funcionários",
  },
];

export const getSpreadsheet = (option: TUpdateOptions) => {
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

export const spreadsheetOptions = {
  mis: ["cpf", "data", "escalados", "faltas", "vendas", "metas"],
  juridico: ["cpf"],
  desligamentos: ["cpf", "data", "tipo"],
  funcionarios: ["cpf"],
};

export const checkMISData = (data: any) => {
  let isMIS = true;

  data.map((row: any) => {
    spreadsheetOptions.mis.map(option => {
      if (!row[option]) {
        isMIS = false;
        return false;
      }
    });
  });

  if (isMIS) {
    let newData: IMISData[] | null = [];
    data.map((row: any) => {
      const dateSplited = row.data.split("/");
      dateSplited.reverse();
      const dateSplitedString = dateSplited.join("-");

      const isDate = dayjs(dateSplitedString).isValid();
      if (!isDate) {
        newData = null;
        return false;
      }

      const date = dayjs(dateSplitedString).toDate();

      newData?.push({
        document: String(row.cpf),
        date: dayjs(date).toISOString(),
        sellCount: Number(row.vendas),
        missCount: Number(row.faltas),
        selectCount: Number(row.escalados),
        rateCount: Number(row.metas),
      });
    });

    return newData;
  }

  return false;
};

export const checkOnlyCpfData = (data: any) => {
  let isOnlyCPF = true;

  data.map((row: any) => {
    Object.entries(row).map(([key, value]) => {
      if (key !== "cpf") {
        isOnlyCPF = false;
        return false;
      }
    });
  });

  if (isOnlyCPF) {
    const newData: ICPFData[] = [];
    data.map((row: any) => {
      newData.push({
        document: row.cpf,
      });
    });

    return newData;
  }

  return false;
};

export const checkDesligamentosData = (data: any) => {
  let isDesligamentos = true;

  data.map((row: any) => {
    spreadsheetOptions.desligamentos.map(option => {
      if (!row[option]) {
        isDesligamentos = false;
        return;
      }
    });
  });

  if (isDesligamentos) {
    let newData: IShutdownData[] | null = [];
    data.map((row: any) => {
      const dateSplited = row.data.split("/");
      dateSplited.reverse();
      const dateSplitedString = dateSplited.join("-");

      const isDate = dayjs(dateSplitedString).isValid();
      if (!isDate) {
        newData = null;
        return false;
      }

      const date = dayjs(dateSplitedString).toDate();

      if (
        dateSplited[2] > 31 ||
        dateSplited[2] < 1 ||
        dateSplited[1] > 12 ||
        dateSplited[1] < 1
      ) {
        newData = null;
        return false;
      } else {
        newData?.push({
          document: row.cpf,
          date: dayjs(date).toISOString(),
          type: row.tipo,
        });
      }
    });

    return newData;
  }

  return false;
};

export const handleCheckSpreadsheetData = (
  data: any,
  option: TUpdateOptions,
) => {
  switch (option) {
    case "MIS":
      return checkMISData(data);
    case "Jurídico":
      return checkOnlyCpfData(data);
    case "Funcionários":
      return checkOnlyCpfData(data);
    case "Desligamentos":
      return checkDesligamentosData(data);
  }
};

export const validateOption = (option: string) => {
  if (validOptions.includes(option)) {
    return option as TUpdateOptions;
  }

  return "MIS" as TUpdateOptions;
};
