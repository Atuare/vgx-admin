import { Upload } from "@/assets/Icons";
import { useEffect, useRef, useState } from "react";
import styles from "./FileInput.module.scss";

interface FileInputProps {
  onChange: (file: File) => void;
  defaultFile?: File;
  disabled?: boolean;
}

export function FileInput({ onChange, defaultFile, disabled }: FileInputProps) {
  const [file, setFile] = useState<File | null>(defaultFile ?? null);

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    file && onChange(file);
  }, [file]);

  return (
    <div className={styles.inputContainer}>
      <input
        type="file"
        id="file"
        ref={input}
        className={styles.inputContainer__input}
        onChange={event => {
          setFile(event.target.files?.[0] ?? null);
        }}
        disabled={!!disabled}
      />
      <div className={styles.inputContainer__left}>
        <label
          htmlFor="file"
          className={styles.inputContainer__left__label}
          style={disabled ? { cursor: "default" } : {}}
        >
          <p>Escolher arquivo...</p>
        </label>

        <p className={styles.inputContainer__left__fileName}>
          {file ? file.name : ""}
        </p>
      </div>

      <div className={styles.inputContainer__uploadIcon}>
        <Upload />
      </div>
    </div>
  );
}
