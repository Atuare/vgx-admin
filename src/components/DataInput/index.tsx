import { ReactNode } from "react";
import styles from "./DataInput.module.scss";

export function DataInput({
  name,
  width,
  required = false,
  children,
}: {
  name: string;
  width?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={styles.dataInput} style={{ width }}>
      <label htmlFor={name}>
        {name}
        {required && <span>*</span>}
      </label>
      <label htmlFor={name}>{!required && <p>(opcional)</p>}</label>
      {children}
    </div>
  );
}
