import { useState } from "react";
import styles from "./Select.module.scss";
import { ChevronDown } from "@/assets/Icons";

interface SelectProps {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder: string;
}

export function Select({ onChange, options, placeholder, value }: SelectProps) {
  const [openSelect, setOpenSelect] = useState(false);

  return (
    <div className={styles.select}>
      <div
        className={`${styles.select__trigger} ${
          openSelect ? styles.active : ""
        }`}
        onClick={() => setOpenSelect(prev => !prev)}
      >
        <span>{value ? value : placeholder}</span>
        <ChevronDown />
      </div>
      {openSelect && (
        <div className={styles.select__list}>
          {options.map(option => (
            <div key={crypto.randomUUID()}>{option}</div>
          ))}
        </div>
      )}
    </div>
  );
}
