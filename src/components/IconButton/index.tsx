import { HTMLAttributes, ReactNode } from "react";
import styles from "./IconButton.module.scss";
interface IconButtonProps extends HTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  buttonType?: "delete" | "edit" | "send";
}

export function IconButton({ icon, buttonType, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.iconButton} ${
        buttonType === "delete"
          ? styles.iconButton__delete
          : buttonType === "edit"
            ? styles.iconButton__edit
            : styles.iconButton__send
      }`}
      {...props}
    >
      {icon}
    </button>
  );
}
