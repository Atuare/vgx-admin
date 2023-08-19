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
  const startHourDec = Math.floor((input.startHour - startHourInt) * 60);
  const endHourInt = Math.floor(input.endHour);
  const endHourDec = Math.floor((input.endHour - endHourInt) * 60);

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
