import { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  buttonType: "primary" | "secondary" | "error" | "default" | "warning";
  icon?: React.ReactNode;
}

/**
 * Componente de botão.
 *
 * @param text - Texto que vai ser mostrado no botão.
 * @param buttonType - Enum com o tipo do estilo do botão.
 * @param icon - Adiciona um ícone no lado direito do texto.
 */

export function Button({ text, buttonType, icon, ...props }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[buttonType]} }`} {...props}>
      {text}
      {icon && icon}
    </button>
  );
}
