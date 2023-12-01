import { getFirstDayOfMonth } from "@/utils/dates";
import dayjs from "dayjs";
import styles from "./CalendarItem.module.scss";

export function CalendarItem({
  day,
  year,
  month,
  index,
  length,
  handleIntervalDays,
  days,
}: {
  day: number;
  year: number;
  month: number;
  index: number;
  length: number;
  handleIntervalDays: (day: number, type: "add" | "remove") => void;
  days: number[];
}) {
  const date = dayjs(`${year}-${month + 1}-${day}`).toDate();

  const borderCondition =
    index !== 0 && ((index + 1) % 7 === 0 || index + 1 === length);
  const radiusCondition = length > 35 ? 35 : 28;
  const daysBeforeAtualMonth = getFirstDayOfMonth(month, year) - 1;
  const isActive =
    index > daysBeforeAtualMonth &&
    dayjs(new Date()).isSame(date, "day") &&
    dayjs(new Date()).isSame(date, "month") &&
    dayjs(new Date()).isSame(date, "year");

  return (
    <div
      className={`${styles.item} ${isActive ? styles.active : ""}`}
      style={{
        borderRadius: index === radiusCondition ? "0 0 0 8px" : "",
        borderBottomRightRadius: index === length - 1 ? "8px" : "",
        borderRight: borderCondition ? "1px solid #e8e8e8" : "",
      }}
      data-state={
        days.find(item => item === day) && index > daysBeforeAtualMonth
          ? "selected"
          : ""
      }
      onClick={() => {
        if (days.find(item => item === day) && index > daysBeforeAtualMonth) {
          handleIntervalDays(day, "remove");
        } else if (index > daysBeforeAtualMonth) {
          handleIntervalDays(day, "add");
        }
      }}
    >
      <div>
        <span>{day}</span>
      </div>
    </div>
  );
}
