import { ChevronDown } from "@/assets/Icons";
import { useEffect, useState } from "react";
import styles from "./Select.module.scss";

interface SelectProps {
  options: { name: string; id: string }[];
  defaultValue?: string | undefined;
  onChange: (value: { name: string; id: string }) => void;
  placeholder: string;
  width?: string | number;
  maxHeight?: string | number;
}

export function Select({
  onChange,
  options,
  placeholder,
  defaultValue,
  width,
  maxHeight,
}: SelectProps) {
  const [openSelect, setOpenSelect] = useState(false);
  const [select, setSelect] = useState<string>(defaultValue ?? "");

  useEffect(() => {
    setSelect(defaultValue ?? "");
    setOpenSelect(false);
  }, [options]);

  return (
    <div className={styles.select} style={{ width }}>
      <button
        className={`${styles.select__trigger} ${
          openSelect ? styles.active : ""
        }`}
        onClick={() => setOpenSelect(prev => !prev)}
        type="button"
        disabled={options.length === 0}
        style={{ cursor: options.length === 0 ? "not-allowed" : "pointer" }}
      >
        <span>{select ? select : placeholder}</span>
        <ChevronDown />
      </button>
      {openSelect && (
        <div
          className={styles.select__list}
          style={{ maxHeight: maxHeight ? maxHeight : 200 }}
        >
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
              className={`${
                option.id === select || option.name === select
                  ? styles.active
                  : ""
              }`}
              key={crypto.randomUUID()}
              onClick={() => {
                setSelect(option.name);
                onChange(option);
                setOpenSelect(false);
              }}
              type="button"
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
