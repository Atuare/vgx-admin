import { Upload } from "@/assets/Icons";
import { Toast } from "@/utils/toast";
import { ChangeEvent, useState } from "react";
import styles from "./FileInput.module.scss";
interface FileInputProps {
  onChange?: (file: File) => void;
  defaultFile?: File | null;
  disabled?: boolean;
  width?: string;
  maxSize?: number;
  allowedTypes?: string[];
  fileName?: string;
}

/**
 * Componente de input para upload de arquivos.
 *
 * @param maxSize - O máximo tamanho do arquivo permitido em MB.
 * @param allowedTypes - Array de string com as extensões de arquivo permitida.
 * @param width - Largura personalida do input.
 * @param disabled - Desativa o upload.
 * @param defaultFile - Arquivo padrão.
 * @param onChange - A função a ser chamada quando o upload é realizado com sucesso.
 */
export function FileInput({
  onChange,
  defaultFile,
  disabled,
  width,
  maxSize = 5,
  allowedTypes = [],
  fileName,
}: FileInputProps) {
  const [file, setFile] = useState<File | null>(defaultFile ?? null);

  const handlePictureChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const fileType = file.type;
    const fileSize = file.size;

    if (
      allowedTypes.length > 0 &&
      !allowedTypes.some(type => fileType.includes(type))
    ) {
      const allowedTypesString = allowedTypes.join(", ");
      Toast(
        "error",
        `O arquivo deve ter o(s) formato(s): ${allowedTypesString}.`,
      );
      event.target.value = "";
      return;
    }

    if (fileSize && fileSize > maxSize * 1e6) {
      Toast("error", `O arquivo deve ter no máximo ${maxSize}MB.`);
      event.target.value = "";
      return;
    }

    onChange?.(file);
    setFile(file);
  };

  return (
    <div className={styles.inputContainer} style={{ width }}>
      <input
        type="file"
        id="file"
        className={styles.inputContainer__input}
        onChange={handlePictureChange}
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
          {file ? file.name : fileName ? fileName : ""}
        </p>
      </div>

      <div className={styles.inputContainer__uploadIcon}>
        <Upload />
      </div>
    </div>
  );
}
