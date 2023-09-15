import { useEffect, useState } from "react";
import styles from "./Radio.module.scss";

interface RadioProps {
  defaultValue?: boolean;
  options?: string[];
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  column?: boolean;
  lightTheme?: boolean;
  defaultFalse?: boolean;
}

export function Radio({
  defaultValue,
  options,
  disabled,
  onChange,
  column = false,
  lightTheme = false,
  defaultFalse = true,
}: RadioProps) {
  const [value, setValue] = useState<boolean | null>(
    defaultValue ? defaultValue : defaultFalse ? false : null,
  );

  useEffect(() => {
    value && onChange?.(value);
  }, [value]);

  return (
    <div className={styles.radio}>
      {[true, false].map(item => (
        <button
          type="button"
          className={styles.radio__item}
          key={crypto.randomUUID()}
          data-state={item === value ? "active" : "inactive"}
          onClick={() => setValue(item)}
          disabled={item !== value && disabled}
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
            flexDirection: column ? "column" : "row",
          }}
        >
          <div
            className={`${styles.radio__thumb} ${
              lightTheme ? styles.light : ""
            }`}
          >
            <div />
          </div>
          {item
            ? options
              ? options[0] || "Sim"
              : "Sim"
            : options
            ? options[1] || "Não"
            : "Não"}
        </button>
      ))}
    </div>
  );
}
