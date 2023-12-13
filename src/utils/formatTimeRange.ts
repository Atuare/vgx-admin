import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

interface IAvailability {
  shift: "MANHÃ" | "TARDE" | "NOITE";
  startHour: string | number;
  endHour: string | number;
}

const convertShift = {
  MANHÃ: "Manhã",
  TARDE: "Tarde",
  NOITE: "Noite",
};

export function formatTimeRange(input: Partial<IAvailability>): string {
  if (!input) return "Não disponível";

  const formattedString = `${
    convertShift[input.shift as keyof typeof convertShift]
  } - ${decimalToTime(Number(input.startHour))} até ${decimalToTime(
    Number(input.endHour),
  )}`;

  return formattedString;
}

export function hourToDecimal(input: string) {
  const hoursMinutes = input.split(/[.:]/);
  const hours = parseInt(hoursMinutes[0], 10);
  const minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
  return (hours + minutes / 60).toFixed(2);
}

export function decimalToTime(decimalTime: number): string {
  const hours = Math.floor(decimalTime);
  const minutes = Math.round((decimalTime - hours) * 60);

  const hoursStr = hours.toString().padStart(2, "0");
  const minutesStr = minutes.toString().padStart(2, "0");

  const timeString = `${hoursStr}:${minutesStr}`;
  return timeString;
}

export function formattedTimeToISOString(time: string) {
  const [hours, minutes] = time.split(":");

  const isoDate = dayjs()
    .utc()
    .hour(parseInt(hours))
    .minute(parseInt(minutes))
    .second(0)
    .millisecond(0)
    .toISOString();

  return isoDate;
}
