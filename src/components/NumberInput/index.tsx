import { ChevronRoundedDown, ChevronRoundedUp } from "@/assets/Icons";
import { useEffect, useState } from "react";
import styles from "./NumberInput.module.scss";

interface NumberInputProps {
  defaultValue?: number;
  onChange?: (value: number) => void;
  width?: number;
  disableManualInput?: boolean;
}

export function NumberInput({
  defaultValue,
  onChange,
  width,
  disableManualInput = false,
}: NumberInputProps) {
  const [value, setValue] = useState<number>(0);

  function handleChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
    if (disableManualInput) return;

    const newValue = event.target.valueAsNumber;
    setValue(newValue);
  }

  useEffect(() => {
    onChange?.(value);
  }, [value]);

  useEffect(() => {
    if (defaultValue) setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className={styles.inputContainer} style={{ width }}>
      <input
        type="number"
        value={value}
        onChange={handleChangeValue}
        disabled={disableManualInput}
      />

      <div className={styles.inputContainer__buttons}>
        <button
          type="button"
          onClick={() => setValue(prev => (isNaN(value) ? 0 : prev + 1))}
        >
          <ChevronRoundedUp />
        </button>
        <hr />
        <button
          type="button"
          onClick={() =>
            setValue(prev => (isNaN(value) ? 0 : prev > 0 ? prev - 1 : prev))
          }
        >
          <ChevronRoundedDown />
        </button>
      </div>
    </div>
  );
}
