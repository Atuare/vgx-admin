import { ReactNode } from "react";
import styles from "./SearchInput.module.scss";

interface SearchInputProps {
  icon?: ReactNode;
  handleChangeValue: (value: string) => void;
  defaultValue?: string;
}

export function SearchInput({
  handleChangeValue,
  icon,
  defaultValue,
}: SearchInputProps) {
  return (
    <div className={styles.inputContainer}>
      {icon && icon}
      <input
        style={{ paddingInline: icon ? "48px" : "16px" }}
        type="search"
        placeholder="Pesquisar..."
        onChange={e => handleChangeValue(e.target.value)}
        defaultValue={defaultValue}
      />
    </div>
  );
}
