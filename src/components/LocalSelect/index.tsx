import { useState } from "react";
import styles from "./LocalSelect.module.scss";
import { ChevronDown } from "@/assets/Icons";
import { Checkbox } from "../Checkbox";

interface SelectProps {
  options: string[];
  defaultValue?: string[];
  onChange: (value: string) => void;
  placeholder: string;
}

export function LocalSelect({
  onChange,
  options,
  placeholder,
  defaultValue,
}: SelectProps) {
  const [openSelect, setOpenSelect] = useState(false);
  const [select, setSelect] = useState<string[]>(defaultValue ?? []);

  function onChangeValue(value: string) {
    if (select.includes(value)) {
      setSelect(prev => [...prev, value]);
    } else {
      setSelect(prev => prev.filter(item => item !== value));
    }

    onChange(value);
  }

  return (
    <div className={styles.select}>
      <div
        className={`${styles.select__trigger} ${
          openSelect ? styles.active : ""
        }`}
        onClick={() => setOpenSelect(prev => !prev)}
      >
        {select.length > 0 ? (
          <div className={styles.select__trigger__items}>
            {defaultValue
              ? defaultValue.map(item => (
                  <LocalSelectItem value={item} key={crypto.randomUUID()} />
                ))
              : select.map(item => (
                  <LocalSelectItem value={item} key={crypto.randomUUID()} />
                ))}
          </div>
        ) : (
          <span>{placeholder}</span>
        )}

        <ChevronDown />
      </div>
      {openSelect && (
        <div className={styles.select__list}>
          {options.map((option, index) => (
            <Checkbox
              value={option}
              onChangeCheckbox={onChangeValue}
              isActive={select.includes(option)}
              iconType="outline"
              key={crypto.randomUUID()}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LocalSelectItem({ value }: { value: string }) {
  return <div className={styles.select__trigger__item}>{value}</div>;
}
