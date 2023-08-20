import { CheckSmall, MinusSmall } from "@/assets/Icons";
import { useState } from "react";
import styles from "./Switch.module.scss";

interface SwitchProps {
  handleSwitchChange: (checked: boolean) => void;
  checked: boolean;
}

export function Switch({ handleSwitchChange, checked }: SwitchProps) {
  const [checkedState, setCheckedState] = useState(checked ?? false);

  const handleChangeValue = () => {
    setCheckedState(prev => !prev);
    handleSwitchChange(!checkedState);
  };

  return (
    <button
      className={`${styles.switch}`}
      onClick={handleChangeValue}
      data-state={checkedState ? "checked" : "unchecked"}
    >
      <div className={styles.switch__thumb} />
      {checkedState ? <CheckSmall /> : <MinusSmall />}
      <label>{checked ? "ATIVO" : "INATIVO"}</label>
    </button>
  );
}
