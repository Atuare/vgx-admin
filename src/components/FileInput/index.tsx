import { Upload } from "@/assets/Icons";
import { Toast } from "@/utils/toast";
import {
  ChangeEvent,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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

export interface IClearFileHandle {
  handleClearFile: () => void;
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

export const FileInput = forwardRef<IClearFileHandle, FileInputProps>(
  (props, ref) => {
    const {
      onChange,
      defaultFile,
      disabled,
      width,
      maxSize = 5,
      allowedTypes = [],
      fileName,
    } = props;

    const [file, setFile] = useState<File | null>(defaultFile ?? null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handlePictureChange = async (
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      const file = event.target.files?.[0];

      if (!file) return;

      const fileType = file.name
        .substring(file.name.lastIndexOf("."))
        .replace(".", "")
        .toLowerCase();
      const fileSize = file.size;

      if (allowedTypes.length > 0 && !allowedTypes.includes(fileType)) {
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

    useImperativeHandle(ref, () => ({
      handleClearFile() {
        handleClearFile();
      },
    }));

    function handleClearFile() {
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    }

    return (
      <div className={styles.inputContainer} style={{ width }}>
        <input
          type="file"
          id="file"
          className={styles.inputContainer__input}
          onChange={handlePictureChange}
          disabled={!!disabled}
          ref={inputRef}
        />
        <div className={styles.inputContainer__left}>
          <label
            htmlFor="file"
            className={styles.inputContainer__left__label}
            style={disabled ? { cursor: "default", display: "none" } : {}}
          >
            <p>Escolher arquivo...</p>
          </label>

          <p className={styles.inputContainer__left__fileName}>
            {file && typeof file !== "string"
              ? file.name
              : fileName
                ? fileName
                : ""}
          </p>
        </div>

        <div className={styles.inputContainer__uploadIcon}>
          <Upload />
        </div>
      </div>
    );
  },
);
FileInput.displayName = "FileInput";
