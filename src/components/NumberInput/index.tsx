import { useState } from "react";
import styles from "./NumberInput.module.scss";
import { ChevronRoundedDown, ChevronRoundedUp } from "@/assets/Icons";

interface NumberInputProps {
  defaultValue?: number;
  onChange: (value: number) => void;
}

export function NumberInput({ defaultValue, onChange }: NumberInputProps) {
  const [value, setValue] = useState<number>(defaultValue ?? 0);

  function handleChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
    const newValue = Number(event.target.value);
    setValue(newValue);
    onChange(newValue);
  }

  return (
    <div className={styles.inputContainer}>
      <input type="number" value={value} onChange={handleChangeValue} />
      <div className={styles.inputContainer__buttons}>
        <button onClick={() => setValue(prev => prev + 1)}>
          <ChevronRoundedUp />
        </button>
        <hr />
        <button onClick={() => setValue(prev => (prev > 0 ? prev - 1 : prev))}>
          <ChevronRoundedDown />
        </button>
      </div>
    </div>
  );
}
