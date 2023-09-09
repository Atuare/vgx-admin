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

export function Checkbox({
  value,
  onChangeCheckbox,
  isActive,
  iconType,
  disabled = false,
  ...props
}: CheckboxProps) {
  const [checked, setChecked] = useState(isActive ?? false);

  // Calculate whether the checkbox is indeterminate
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
        if (!disabled) {
          if (!isIndeterminate) {
            const newChecked = !checked;
            setChecked(newChecked);
            onChangeCheckbox?.(newChecked, value);
          }
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
