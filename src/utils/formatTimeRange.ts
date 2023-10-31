import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

interface TimeRangeInput {
  startDay: number;
  endDay: number;
  startHour: number;
  endHour: number;
}

export function formatTimeRange(input: TimeRangeInput): string {
  if (!input) return "Não disponível";

  const dayOfWeek: Record<number, string> = {
    0: "Dom",
    1: "Seg",
    2: "Ter",
    3: "Qua",
    4: "Qui",
    5: "Sex",
    6: "Sáb",
  };

  const startDayName = dayOfWeek[input.startDay];
  const endDayName = dayOfWeek[input.endDay];

  const startHourInt = Math.floor(input.startHour);
  const startHourDec = Math.round((input.startHour - startHourInt) * 60);
  const endHourInt = Math.floor(input.endHour);
  const endHourDec = Math.round((input.endHour - endHourInt) * 60);

  const formattedStartHour = `${startHourInt
    .toString()
    .padStart(2, "0")}:${startHourDec.toString().padStart(2, "0")}`;
  const formattedEndHour = `${endHourInt
    .toString()
    .padStart(2, "0")}:${endHourDec.toString().padStart(2, "0")}`;

  const totalMinutes =
    (endHourInt - startHourInt) * 60 + (endHourDec - startHourDec);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  const formattedString = `${startDayName} a ${endDayName} - ${formattedStartHour} às ${formattedEndHour} (${totalHours}h${
    remainingMinutes > 0 ? `${remainingMinutes}m diárias` : " diárias"
  })`;

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
