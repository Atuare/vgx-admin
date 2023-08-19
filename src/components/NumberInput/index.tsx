import { ChevronRoundedDown, ChevronRoundedUp } from "@/assets/Icons";
import { useEffect, useState } from "react";
import styles from "./NumberInput.module.scss";

interface NumberInputProps {
  defaultValue?: number;
  onChange: (value: number) => void;
}

export function NumberInput({ defaultValue, onChange }: NumberInputProps) {
  const [value, setValue] = useState<number>(defaultValue ?? 0);

  function handleChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = Number(event.target.value);
    setValue(newValue);
  }

  useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        value={value}
        onChange={handleChangeValue}
        pattern="^[0-9]*$"
      />

      <div className={styles.inputContainer__buttons}>
        <button type="button" onClick={e => setValue(prev => prev + 1)}>
          <ChevronRoundedUp />
        </button>
        <hr />
        <button
          type="button"
          onClick={e => setValue(prev => (prev > 0 ? prev - 1 : prev))}
        >
          <ChevronRoundedDown />
        </button>
      </div>
    </div>
  );
}
