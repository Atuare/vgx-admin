import { ReactNode } from "react";
import styles from "./DataInput.module.scss";

export function DataInput({
  name,
  width,
  required = false,
  optional = false,
  children,
  error,
  lightName,
}: {
  name: string;
  width?: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
  optional?: boolean;
  lightName?: string;
}) {
  return (
    <div className={styles.dataInput} style={{ width }}>
      <label htmlFor={name}>
        {name}
        {lightName && <span className={styles.lightName}> {lightName}</span>}
        {required && <span className={styles.required}>*</span>}
      </label>
      <label htmlFor={name}>{optional && <p>(opcional)</p>}</label>
      {children}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
