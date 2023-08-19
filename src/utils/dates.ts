import dayjs from "dayjs";

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
