import { useEffect, useState } from "react";
import styles from "./Radio.module.scss";

interface RadioProps {
  defaultValue?: boolean;
  onChange: (value: boolean) => void;
}

export function Radio({ defaultValue, onChange }: RadioProps) {
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
        >
          <div className={styles.radio__thumb}>
            <div />
          </div>
          {item ? "Sim" : "Não"}
        </button>
      ))}
    </div>
  );
}
