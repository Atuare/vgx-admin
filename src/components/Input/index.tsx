import { HTMLAttributes } from "react";
import styles from "./Input.module.scss";

interface InputProps extends HTMLAttributes<HTMLInputElement> {
  width?: number;
  height?: number;
  disabled?: boolean;
}

export function Input({
  disabled = false,
  width,
  height,
  ...props
}: InputProps) {
  return (
    <input
      className={styles.input}
      disabled={disabled}
      style={{
        width,
        height,
      }}
      {...props}
    />
  );
}
