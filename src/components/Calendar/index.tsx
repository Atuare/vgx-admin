"use client";
import { useEffect, useState } from "react";
import styles from "./Calendar.module.scss";
import { ArrowLeft, ArrowRight, TriangleDown } from "@/assets/Icons";
import { CalendarDropdown } from "../CalendarDropdown";
import {
  daysOfWeek,
  getDaysInMonth,
  handleNextDate,
  handlePreviousDate,
  months,
} from "@/utils/dates";
import dayjs from "dayjs";

export function Calendar() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [daysInMonth, setDaysInMonth] = useState<number[]>(
    getDaysInMonth(month, year),
  );

  const handleChangeMonth = (month: number) => {
    setMonth(month);
  };

  const handleChangeYear = (year: number) => {
    setYear(year);
  };

  const handleToggleDate = (type: "previous" | "next") => {
    const { newYear, newMonth } =
      type === "previous"
        ? handlePreviousDate(month, year)
        : handleNextDate(month, year);
    setMonth(newMonth);
    setYear(newYear);
  };

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(month, year));
  }, [month, year]);

  return (
    <div className={styles.calendar}>
      <header className={styles.calendar__header}>
        <button
          className={styles.calendar__switch}
          onClick={() => setOpenDropdown(prev => !prev)}
        >
          {months[month]} {year} <TriangleDown />
        </button>
        <div className={styles.calendar__pagination}>
          <button onClick={() => handleToggleDate("previous")}>
            <ArrowLeft />
          </button>
          <button onClick={() => handleToggleDate("next")}>
            <ArrowRight />
          </button>
        </div>
      </header>

      <div className={styles.calendar__days}>
        <header className={styles.days__header}>
          {daysOfWeek.map((day, index) => (
            <span
              key={crypto.randomUUID()}
              style={{
                borderRight: index === 6 ? "1px solid #e8e8e8" : "",
                borderRadius:
                  (index === 0 ? "8px 0 0 0" : "") ||
                  (index === 6 ? "0 8px 0 0" : ""),
              }}
            >
              {day.slice(0, 3)}
            </span>
          ))}
        </header>
        <div className={styles.days__list}>
          {daysInMonth.map((day, index) => (
            <CalendarItem
              key={crypto.randomUUID()}
              day={day}
              month={month}
              year={year}
              index={index}
              length={daysInMonth.length}
            />
          ))}
        </div>
      </div>

      {openDropdown && (
        <CalendarDropdown
          handleChangeMonth={handleChangeMonth}
          handleChangeYear={handleChangeYear}
          year={year}
          month={month}
        />
      )}
    </div>
  );
}

function CalendarItem({
  day,
  year,
  month,
  index,
  length,
}: {
  day: number;
  year: number;
  month: number;
  index: number;
  length: number;
}) {
  const date = dayjs(`${year}-${month + 1}-${day}`).toDate();
  const isActive =
    dayjs(new Date()).isSame(date, "day") &&
    dayjs(new Date()).isSame(date, "month") &&
    dayjs(new Date()).isSame(date, "year");

  const borderCondition =
    index !== 0 && ((index + 1) % 7 === 0 || index + 1 === length);

  return (
    <div
      className={`${styles.calendar__item} ${isActive ? styles.active : ""}`}
      style={{
        borderRadius: index === 28 ? "0 0 0 8px" : "",
        borderRight: borderCondition ? "1px solid #e8e8e8" : "",
      }}
    >
      <div>
        <span>{day}</span>
      </div>
    </div>
  );
}
