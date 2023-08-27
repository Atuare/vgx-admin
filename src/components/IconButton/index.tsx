import { HTMLAttributes, ReactNode } from "react";
import styles from "./IconButton.module.scss";
interface IconButtonProps extends HTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  buttonType: "delete" | "edit";
}

export function IconButton({ icon, buttonType, ...props }: IconButtonProps) {
  return (
    <button
      className={`${styles.iconButton} ${
        buttonType === "delete"
          ? styles.iconButton__delete
          : styles.iconButton__edit
      }`}
      {...props}
    >
      {icon}
    </button>
  );
}
