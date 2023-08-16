"use client";
import styles from "./Button.module.scss";
import { ButtonHTMLAttributes, useEffect, useState } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  buttonType: "primary" | "secondary" | "error" | "default";
  icon?: React.ReactNode;
}

export function Button({ text, buttonType, icon, ...props }: ButtonProps) {
  const [clicked, setClicked] = useState<boolean>(false);

  return (
    <button
      className={`${clicked ? styles.pressed : ""}  ${styles.button} ${
        styles[buttonType]
      } }`}
      onClick={() => setClicked(true)}
      {...props}
    >
      {text}
      {icon && icon}
    </button>
  );
}
