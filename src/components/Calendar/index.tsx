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
import { CalendarItem } from "../CalendarItem";

interface CalendarProps {
  handleToggleCalendarDate: (startDate: string, endDate: string) => void;
}

export function Calendar({ handleToggleCalendarDate }: CalendarProps) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [daysInMonth, setDaysInMonth] = useState<number[]>(
    getDaysInMonth(month, year),
  );
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

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

  const handleIntervalDays = (day: number, type: "add" | "remove") => {
    if (type === "add") {
      setSelectedDays(prev => [...prev, day]);
    } else {
      setSelectedDays(prev => prev.filter(item => item !== day));
    }
  };

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(month, year));
  }, [month, year]);

  useEffect(() => {
    if (selectedDays.length > 1) {
      const maxDay = Math.max(...selectedDays);
      const minDay = Math.min(...selectedDays);

      const startDate = dayjs(`${year}-${month + 1}-${minDay}`).toISOString();
      const endDate = dayjs(`${year}-${month + 1}-${maxDay}`).toISOString();

      handleToggleCalendarDate(startDate, endDate);
    } else {
      handleToggleCalendarDate("", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDays]);

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
              handleIntervalDays={handleIntervalDays}
              days={selectedDays}
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
