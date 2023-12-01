import {
  CheckboxBlank,
  CheckboxFill,
  CheckboxFillOutlined,
} from "@/assets/Icons";
import { ButtonHTMLAttributes, ReactNode, useState } from "react";
import styles from "./Checkbox.module.scss";

interface CheckboxProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string;
  onChangeCheckbox?: (value: boolean, name?: string) => void;
  isActive?: boolean | "indeterminate";
  iconType: "solid" | "outline";
  icon?: ReactNode;
  singleSelect?: boolean;
  disabled?: boolean;
}

/**
 * Componente de checkbox.
 *
 * @param value - Texto a ser colocado ao lado do trigger do checkbox.
 * @param onChangeCheckbox - Função que é chamada após o valor do checkbox alterar.
 * @param isActive - Estado inicial do checkbox.
 * @param disabled - Desativa o trigger do checkbox.
 * @param iconType - Enum do tipo do ícone do checkbox.
 * @param icon- Ícone personalizado que fica do lado direito do texto.
 * @param singleSelect- Quando true, o checkbox só pode ser selecionado uma vez.
 */
export function Checkbox({
  value,
  onChangeCheckbox,
  isActive = false,
  iconType,
  disabled = false,
  singleSelect = false,
  icon,
  ...props
}: CheckboxProps) {
  const [checked, setChecked] = useState(isActive);

  const isIndeterminate = checked === "indeterminate";

  return (
    <button
      className={`${styles.checkbox} ${
        iconType === "solid" ? styles.primaryOne : styles.primaryTwo
      } ${disabled ? styles.disabled : ""}`}
      style={{
        padding: iconType === "solid" ? "4px" : "16px",
      }}
      onClick={() => {
        if (!disabled && !isIndeterminate) {
          const newChecked = !checked;
          setChecked(singleSelect ? isActive : newChecked);
          onChangeCheckbox?.(newChecked, value);
        }
      }}
      type="button"
      {...props}
    >
      <span className={styles.checkbox__iconTrigger}>
        {isIndeterminate ? (
          <CheckboxFillOutlined /> // Use the indeterminate icon
        ) : checked ? (
          iconType === "solid" ? (
            <CheckboxFill />
          ) : (
            <CheckboxFillOutlined />
          )
        ) : (
          <CheckboxBlank />
        )}
      </span>
      {value && <span>{value}</span>}
      {icon && <span className={styles.checkbox__icon}>{icon}</span>}
    </button>
  );
}
