import { useEffect, useState } from "react";
import styles from "./Radio.module.scss";

interface RadioProps {
  defaultValue?: boolean;
  options?: string[];
  disabled?: boolean;
  onChange: (value: boolean) => void;
}

export function Radio({
  defaultValue,
  options,
  disabled,
  onChange,
}: RadioProps) {
  const [value, setValue] = useState<boolean>(defaultValue ?? false);

  useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <div className={styles.radio}>
      {[true, false].map(item => (
        <button
          className={styles.radio__item}
          key={crypto.randomUUID()}
          data-state={item === value ? "active" : "inactive"}
          onClick={() => setValue(item)}
          disabled={item !== value && disabled}
          style={disabled ? { cursor: "default" } : {}}
        >
          <div className={styles.radio__thumb}>
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
