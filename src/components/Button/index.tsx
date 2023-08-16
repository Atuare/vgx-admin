import styles from "./Button.module.scss";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  buttonType: "primary" | "secondary" | "error" | "default";
  icon?: React.ReactNode;
}

export function Button({ text, buttonType, icon, ...props }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[buttonType]} }`} {...props}>
      {text}
      {icon && icon}
    </button>
  );
}
