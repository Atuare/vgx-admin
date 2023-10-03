import { ReactNode } from "react";
import styles from "../../DataModal.module.scss";

export function InputContainer({
  title,
  children,
  htmlFor,
  width,
  lightTitle,
  error,
}: {
  title: string;
  children: ReactNode;
  htmlFor?: string;
  width?: number | string;
  lightTitle?: string;
  error?: string;
}) {
  return (
    <div className={styles.modal__content__form__input} style={{ width }}>
      <div className={styles.label__container}>
        <label htmlFor={htmlFor || title}>{title}</label>
        {lightTitle && <span>{lightTitle}</span>}
      </div>
      {children}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
