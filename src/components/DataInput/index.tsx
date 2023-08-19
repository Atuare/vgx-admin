import { ReactNode } from "react";
import styles from "./DataInput.module.scss";

export function DataInput({
  name,
  width,
  required = false,
  children,
  error,
}: {
  name: string;
  width?: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
}) {
  return (
    <div className={styles.dataInput} style={{ width }}>
      <label htmlFor={name}>
        {name}
        {required && <span>*</span>}
      </label>
      <label htmlFor={name}>{!required && <p>(opcional)</p>}</label>
      {children}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
