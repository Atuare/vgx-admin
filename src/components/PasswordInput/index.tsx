import { VisibilityOff, VisibilityOn } from "@/assets/Icons";
import { useState } from "react";
import styles from "./PasswordInput.module.scss";

interface PasswordInputProps {
  name: string;
  onChangePassword: (value: string) => void;
  error?: string;
}

export function PasswordInput({
  name,
  onChangePassword,
  error,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.input}>
      <label htmlFor={name}>{name}</label>
      <div className={styles.inputContainer}>
        <input
          id={name}
          onChange={e => onChangePassword(e.target.value)}
          type={showPassword ? "text" : "password"}
        />
        {showPassword ? (
          <button onClick={() => setShowPassword(false)} type="button">
            <VisibilityOn />
          </button>
        ) : (
          <button onClick={() => setShowPassword(true)} type="button">
            <VisibilityOff />
          </button>
        )}
      </div>
      <span className={styles.error}>{error}</span>
    </div>
  );
}
