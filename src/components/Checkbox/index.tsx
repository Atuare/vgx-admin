import {
  CheckboxBlank,
  CheckboxFill,
  CheckboxFillOutlined,
} from "@/assets/Icons";
import { ButtonHTMLAttributes, useState } from "react";
import styles from "./Checkbox.module.scss";

interface CheckboxProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string;
  onChangeCheckbox?: (value: boolean, name?: string) => void;
  isActive?: boolean | "indeterminate";
  iconType: "solid" | "outline";
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
 */
export function Checkbox({
  value,
  onChangeCheckbox,
  isActive,
  iconType,
  disabled = false,
  ...props
}: CheckboxProps) {
  const [checked, setChecked] = useState(isActive ?? false);

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
          setChecked(isActive ? isActive : newChecked);
          onChangeCheckbox?.(newChecked, value);
        }
      }}
      type="button"
      {...props}
    >
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
      {value && <span>{value}</span>}
    </button>
  );
}
