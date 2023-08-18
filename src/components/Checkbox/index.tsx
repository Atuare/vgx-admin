import {
  CheckboxBlank,
  CheckboxFill,
  CheckboxFillOutlined,
} from "@/assets/Icons";
import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  value: string;
  onChangeCheckbox: (value: string, action: "add" | "remove") => void;
  isActive: boolean;
  iconType: "solid" | "outline";
}

export function Checkbox({
  value,
  onChangeCheckbox,
  isActive,
  iconType,
  ...props
}: CheckboxProps) {
  function onChange() {
    onChangeCheckbox(value, isActive ? "remove" : "add");
  }

  return (
    <button
      className={`${styles.checkbox} ${
        iconType === "solid" ? styles.primaryOne : styles.primaryTwo
      }`}
      onClick={onChange}
      {...props}
    >
      {isActive ? (
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
