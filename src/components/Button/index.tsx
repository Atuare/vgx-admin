"use client";
import styles from "./Button.module.scss";
import { ButtonHTMLAttributes, useEffect, useState } from "react";

interface ButtonProps {
  text: string;
  type: "primary" | "secondary";
  icon?: React.ReactNode;
  props?: ButtonHTMLAttributes<HTMLButtonElement>;
}

export function Button({ text, props, type, icon }: ButtonProps) {
  const [clicked, setClicked] = useState<boolean>(false);

  return (
    <button
      className={`${clicked ? styles.pressed : ""}  ${styles.button} ${
        styles[type]
      } }`}
      {...props}
      onClick={() => setClicked(true)}
    >
      {text}
      {icon && icon}
    </button>
  );
}
