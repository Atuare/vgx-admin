import { useState } from "react";
import styles from "./CalendarDropdown.module.scss";
import "@/styles/scrollbar.scss";
import { generateYears, months } from "@/utils/dates";
import { Check, TriangleDown } from "@/assets/Icons";

interface CalendarDropdownProps {
  handleChangeMonth: (month: number) => void;
  handleChangeYear: (year: number) => void;
  month: number;
  year: number;
}

export function CalendarDropdown({
  handleChangeMonth,
  handleChangeYear,
  month,
  year,
}: CalendarDropdownProps) {
  const [selected, setSelected] = useState<"month" | "year">("month");

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdown__header}>
        <HeaderTrigger
          selected={selected}
          setSelected={setSelected}
          type="month"
          value={months[month].slice(0, 3)}
        />
        <HeaderTrigger
          selected={selected}
          setSelected={setSelected}
          type="year"
          value={year}
        />
      </div>
      <div className={styles.dropdown__list}>
        {selected === "month"
          ? months.map((item, index) => (
              <button
                key={crypto.randomUUID()}
                onClick={() => handleChangeMonth(index)}
                disabled={
                  index > new Date().getMonth() &&
                  year === new Date().getFullYear()
                }
                className={`${index === month ? styles.active : ""}`}
              >
                <Check />
                {item}
              </button>
            ))
          : generateYears().map(item => (
              <button
                key={crypto.randomUUID()}
                onClick={() => handleChangeYear(item)}
                disabled={
                  month > new Date().getMonth() &&
                  item === new Date().getFullYear()
                }
                className={`${item === year ? styles.active : ""}`}
              >
                <Check />
                {item}
              </button>
            ))}
      </div>
    </div>
  );
}

function HeaderTrigger({
  selected,
  setSelected,
  value,
  type,
}: {
  selected: "month" | "year";
  setSelected: (value: "month" | "year") => void;
  value: number | string;
  type: "month" | "year";
}) {
  return (
    <button
      onClick={() => setSelected(type)}
      className={`${selected === type ? styles.active : ""}`}
    >
      {value}
      {selected === type && <TriangleDown />}
    </button>
  );
}
