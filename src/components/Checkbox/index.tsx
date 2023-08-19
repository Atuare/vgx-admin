import {
  CheckboxBlank,
  CheckboxFill,
  CheckboxFillOutlined,
} from "@/assets/Icons";
import { useState } from "react";
import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  value: string;
  onChangeCheckbox: (value: boolean, name?: string) => void;
  isActive?: boolean;
  iconType: "solid" | "outline";
}

export function Checkbox({
  value,
  onChangeCheckbox,
  isActive,
  iconType,
}: CheckboxProps) {
  const [checked, setChecked] = useState(isActive ?? false);

  return (
    <button
      className={`${styles.checkbox} ${
        iconType === "solid" ? styles.primaryOne : styles.primaryTwo
      } `}
      style={{
        padding: iconType === "solid" ? "4px" : "16px",
      }}
      onClick={() => {
        setChecked(prev => !prev);
        onChangeCheckbox(!checked, value);
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
