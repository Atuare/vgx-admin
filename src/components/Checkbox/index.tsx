import {
  CheckboxBlank,
  CheckboxFill,
  CheckboxFillOutlined,
} from "@/assets/Icons";
import { useState } from "react";
import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  value: string;
  onChangeCheckbox?: (value: boolean, name?: string) => void;
  isActive?: boolean;
  iconType: "solid" | "outline";
  disabled?: boolean;
}

export function Checkbox({
  value,
  onChangeCheckbox,
  isActive,
  iconType,
  disabled = false,
}: CheckboxProps) {
  const [checked, setChecked] = useState(isActive ?? false);

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
          setChecked(prev => !prev);
          onChangeCheckbox?.(!checked, value);
        }
      }}
    >
      {checked ? (
        iconType === "solid" ? (
          <CheckboxFill />
        ) : (
          <CheckboxFillOutlined />
        )
      ) : (
        <CheckboxBlank />
      )}
      <span>{value}</span>
    </button>
  );
}
