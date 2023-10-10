import { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  buttonType: "primary" | "secondary" | "error" | "default" | "warning";
  icon?: React.ReactNode;
  iconLeft?: boolean;
}

/**
 * Componente de botão.
 *
 * @param text - Texto que vai ser mostrado no botão.
 * @param buttonType - Enum com o tipo do estilo do botão.
 * @param icon - Adiciona um ícone no lado direito do texto.
 * @param iconLeft - Boolean para colocar o ícone para a esquerda.
 */

export function Button({
  text,
  buttonType,
  icon,
  iconLeft = false,
  ...props
}: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[buttonType]} }`} {...props}>
      {iconLeft && icon && icon}
      {text}
      {!iconLeft && icon && icon}
    </button>
  );
}
