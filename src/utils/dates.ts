import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const daysOfWeek = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export const daysOfWeekInEnglish = [
  {
    name: "Domingo",
    id: "SUNDAY",
  },
  {
    name: "Segunda-Feira",
    id: "MONDAY",
  },
  {
    name: "Terça-Feira",
    id: "TUESDAY",
  },
  {
    name: "Quarta-Feira",
    id: "WEDNESDAY",
  },
  {
    name: "Quinta-Feira",
    id: "THURSDAY",
  },
  {
    name: "Sexta-Feira",
    id: "FRIDAY",
  },
  {
    name: "Sábado",
    id: "SATURDAY",
  },
];

export const convertDayOfWeek = (day?: string) => {
  switch (day) {
    case "SUNDAY":
      return "Domingo";
    case "MONDAY":
      return "Segunda-Feira";
    case "TUESDAY":
      return "Terça-Feira";
    case "WEDNESDAY":
      return "Quarta-Feira";
    case "THURSDAY":
      return "Quinta-Feira";
    case "FRIDAY":
      return "Sexta-Feira";
    case "SATURDAY":
      return "Sábado";
    default:
      return "";
  }
};

export const convertDayOfWeekToEnglish = (day?: string) => {
  switch (day) {
    case "Domingo":
      return "SUNDAY";
    case "Segunda-Feira":
      return "MONDAY";
    case "Terça-Feira":
      return "TUESDAY";
    case "Quarta-Feira":
      return "WEDNESDAY";
    case "Quinta-Feira":
      return "THURSDAY";
    case "Sexta-Feira":
      return "FRIDAY";
    case "Sábado":
      return "SATURDAY";
    default:
      return "";
  }
};

export const daysOfWeekSelect = [
  {
    name: "Domingo",
    id: "Dom",
  },
  {
    name: "Segunda",
    id: "Seg",
  },
  {
    name: "Terça",
    id: "Ter",
  },
  {
    name: "Quarta",
    id: "Qua",
  },
  {
    name: "Quinta",
    id: "Qui",
  },
  {
    name: "Sexta",
    id: "Sex",
  },
  {
    name: "Sábado",
    id: "Sáb",
  },
];

export const dayOfWeek: Record<string, number> = {
  Dom: 0,
  Seg: 1,
  Ter: 2,
  Qua: 3,
  Qui: 4,
  Sex: 5,
  Sáb: 6,
};

export function generateYears() {
  const years = [];
  for (let i = new Date().getFullYear(); i >= 1970; i--) {
    years.push(i);
  }
  return years;
}

export const handleNextDate = (month: number, year: number) => {
  const newYear =
    year !== new Date().getFullYear() && month === 11 ? year + 1 : year;

  // Se o mês for diferente de Dezembro, incrementa o mês, senão, volta para 0
  const incrementMonth = month !== 11 ? month + 1 : 0;

  // Se o ano for igual ao atual e o mês for igual a Dezembro, mantém o mês em Dezembro, senão, incrementa o mês
  let newMonth =
    year === new Date().getFullYear() && month === 11 ? 11 : incrementMonth;

  const isSameMonth = month === new Date().getMonth();
  if (isSameMonth) newMonth = month;

  return {
    newYear,
    newMonth,
  };
};

export const handlePreviousDate = (month: number, year: number) => {
  const newYear = year !== 1970 && month === 0 ? year - 1 : year;

  // Se o mês for diferente de Janeiro, decrementa o mês, senão, volta para Dezembro
  const decrementMonth = month !== 0 ? month - 1 : 11;

  // Se o ano for igual a 1970 e o mês for igual a Janeiro, mantém o mês em Janeiro, senão, decrementa o mês
  const newMonth = year === 1970 && month === 0 ? 0 : decrementMonth;

  return {
    newYear,
    newMonth,
  };
};

export function getDaysInMonth(month: number, year: number) {
  const days = [];
  const previousDays = [];
  const date = `${year}-${month + 1}-01`;
  const daysInMonth = dayjs(date).daysInMonth();

  const { newMonth, newYear } = handlePreviousDate(month, year);
  const previousDate = `${newYear}-${newMonth + 1}-01`;
  const daysInPreviousMonth = dayjs(previousDate).daysInMonth();

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  for (let i = 1; i <= daysInPreviousMonth; i++) {
    previousDays.push(i);
  }

  previousDays.reverse();

  for (let i = 0; i < getFirstDayOfMonth(month, year); i++) {
    days.unshift(previousDays[i]);
  }

  return days;
}

export function getFirstDayOfMonth(month: number, year: number) {
  const date = new Date(year, month, 1);
  return date.getDay();
}

export function formatDateTime(dateTimeValue: Date) {
  const formattedDate = dayjs(dateTimeValue).format("YYYY-MM-DD");
  return formattedDate;
}

export const isAfterYesterday = (value?: Date | null) => {
  const currentDate = dayjs();
  const yesterday = currentDate.subtract(1, "day").endOf("day").utc();

  if (!value) {
    return true; // Permite valores undefined ou null
  }
  return dayjs(value).isAfter(yesterday);
};

export const getDayOfWeekName = (day: number | undefined) => {
  switch (day) {
    case 0:
      return "Domingo";
    case 1:
      return "Segunda";
    case 2:
      return "Terça";
    case 3:
      return "Quarta";
    case 4:
      return "Quinta";
    case 5:
      return "Sexta";
    case 6:
      return "Sábado";
    default:
      return "";
  }
};

export const convertStringDateToDate = (date: string) => {
  return dayjs(date).toISOString();
};

export const convertStringTimeToDate = (time: string) => {
  return dayjs()
    .set("hour", Number(time.split(":")[0]))
    .set("minute", Number(time.split(":")[1]))
    .toISOString();
};
