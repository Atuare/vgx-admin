import { useEffect, useState } from "react";
import { CheckSmall, MinusSmall } from "@/assets/Icons";
import styles from "./Switch.module.scss";

interface SwitchProps {
  handleSwitchChange: (checked: boolean) => void;
  checked: "ATIVO" | "INATIVO";
}

export function Switch({ handleSwitchChange, checked }: SwitchProps) {
  const [checkedState, setCheckedState] = useState(
    checked === "ATIVO" ? true : false,
  );

  const handleChangeValue = () => {
    setCheckedState(prev => !prev);
    handleSwitchChange(checkedState);
  };

  return (
    <button
      className={`${styles.switch}`}
      onClick={handleChangeValue}
      data-state={checkedState ? "checked" : "unchecked"}
    >
      <div className={styles.switch__thumb} />
      {checkedState ? <CheckSmall /> : <MinusSmall />}
    </button>
  );
}
