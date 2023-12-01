import { ReactNode } from "react";
import styles from "../../DataModal.module.scss";

export function InputContainer({
  title,
  children,
  htmlFor,
  width,
  height,
  lightTitle,
  error,
}: {
  title?: string;
  children: ReactNode;
  htmlFor?: string;
  width?: number | string;
  height?: number | string;
  lightTitle?: string;
  error?: string;
}) {
  return (
    <div
      className={styles.modal__content__form__input}
      style={{ width, height }}
    >
      <div className={styles.label__container}>
        {title && <label htmlFor={htmlFor || title}>{title}</label>}
        {lightTitle && <span>{lightTitle}</span>}
      </div>
      {children}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
