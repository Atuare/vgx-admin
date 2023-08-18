import { useEffect, useRef, useState } from "react";
import styles from "./FileInput.module.scss";
import { Upload } from "@/assets/Icons";

interface FileInputProps {
  onChange: (file: File) => void;
}

export function FileInput({ onChange }: FileInputProps) {
  const [file, setFile] = useState<File | null>(null);

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
      />
      <div className={styles.inputContainer__left}>
        <label htmlFor="file" className={styles.inputContainer__left__label}>
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
