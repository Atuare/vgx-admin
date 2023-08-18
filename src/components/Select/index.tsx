import { useState } from "react";
import styles from "./Select.module.scss";
import { ChevronDown } from "@/assets/Icons";

interface SelectProps {
  options: string[];
  defaultValue?: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function Select({
  onChange,
  options,
  placeholder,
  defaultValue,
}: SelectProps) {
  const [openSelect, setOpenSelect] = useState(false);
  const [select, setSelect] = useState<string>(defaultValue ?? "");

  return (
    <div className={styles.select}>
      <div
        className={`${styles.select__trigger} ${
          openSelect ? styles.active : ""
        }`}
        onClick={() => setOpenSelect(prev => !prev)}
      >
        <span>
          {defaultValue ? defaultValue : select ? select : placeholder}
        </span>
        <ChevronDown />
      </div>
      {openSelect && (
        <div className={styles.select__list}>
          {options.map((option, index) => (
            <button
              style={{
                borderRadius:
                  options.length === 1
                    ? "8px"
                    : index === 0
                    ? "8px 8px 0 0"
                    : index + 1 === options.length
                    ? "0 0 8px 8px"
                    : "",
              }}
              className={`${option === select ? styles.active : ""}`}
              key={crypto.randomUUID()}
              onClick={() => {
                setSelect(option);
                onChange(option);
                setOpenSelect(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
