import { useEffect, useState } from "react";
import styles from "./NumberInput.module.scss";
import { ChevronRoundedDown, ChevronRoundedUp } from "@/assets/Icons";

interface NumberInputProps {
  defaultValue?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

export function NumberInput({
  defaultValue,
  disabled,
  onChange,
}: NumberInputProps) {
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
        type="number"
        value={value}
        onChange={handleChangeValue}
        disabled={!!disabled}
      />
      {!disabled && (
        <div className={styles.inputContainer__buttons}>
          <button
            onClick={() => setValue(prev => prev + 1)}
            disabled={!!disabled}
            style={disabled ? { cursor: "default" } : {}}
          >
            <ChevronRoundedUp />
          </button>
          <hr />
          <button
            onClick={() => setValue(prev => (prev > 0 ? prev - 1 : prev))}
            disabled={!!disabled}
            style={disabled ? { cursor: "default" } : {}}
          >
            <ChevronRoundedDown />
          </button>
        </div>
      )}
    </div>
  );
}
