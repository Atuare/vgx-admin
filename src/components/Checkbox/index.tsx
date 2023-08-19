import {
  CheckboxBlank,
  CheckboxFill,
  CheckboxFillOutlined,
} from "@/assets/Icons";
import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  value: string;
  onChangeCheckbox: (value: string) => void;
  isActive: boolean;
  iconType: "solid" | "outline";
  disabled?: boolean;
}

export function Checkbox({
  value,
  onChangeCheckbox,
  isActive,
  iconType,
  disabled,
  ...props
}: CheckboxProps | any) {
  function onChange() {
    onChangeCheckbox(value);
  }

  return (
    <button
      className={`${styles.checkbox} ${
        iconType === "solid" ? styles.primaryOne : styles.primaryTwo
      } ${disabled ? styles.disabled : ""}`}
      style={{
        padding: iconType === "solid" ? "4px" : "16px",
        cursor: disabled ? "default" : "pointer",
      }}
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
