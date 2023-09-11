import { Upload } from "@/assets/Icons";
import { ChangeEvent, useRef, useState } from "react";
import styles from "./FileInput.module.scss";

interface FileInputProps {
  onChange: (file: File, event?: ChangeEvent<HTMLInputElement>) => void;
  defaultFile?: File;
  disabled?: boolean;
  width?: string;
}

export function FileInput({
  onChange,
  defaultFile,
  disabled,
  width,
}: FileInputProps) {
  const [file, setFile] = useState<File | null>(defaultFile ?? null);

  const input = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.inputContainer} style={{ width }}>
      <input
        type="file"
        id="file"
        ref={input}
        className={styles.inputContainer__input}
        onChange={event => {
          setFile(event.target.files?.[0] ?? null);
          if (event.target.files?.[0]) {
            onChange(event.target.files?.[0], event);
          }
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
