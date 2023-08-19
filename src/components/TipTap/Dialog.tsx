import { Editor } from "@tiptap/react";
import { ReactNode, useState } from "react";
import { Button } from "../Button";
import styles from "./TipTap.module.scss";

interface ActionsProps extends React.ComponentPropsWithoutRef<"button"> {
  icon: React.ReactNode;
  isActive?: boolean;
}

interface DialogProps {
  onChange: (value: string, action: "remove" | "add") => void;
  editor: Editor;
  icon: ReactNode;
  type: "image" | "link";
}

export function Dialog({ onChange, editor, icon, type }: DialogProps) {
  const [value, setValue] = useState<string>(editor.getAttributes("link").href);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className={styles.dialog}>
      <ActionButton
        icon={icon}
        isActive={editor.isActive(type)}
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className={styles.dialog__list}>
          <h4>Adicionar {type === "image" ? "imagem" : "link"}</h4>
          <input
            type="url"
            value={value}
            placeholder="Insira uma url"
            onChange={e => setValue(e.target.value)}
          />
          <div className={styles.dialog__list__buttons}>
            {type !== "image" && (
              <Button
                type="button"
                buttonType="error"
                text="Remover"
                onClick={() => {
                  onChange(value, "remove");
                  setOpen(false);
                }}
              />
            )}
            <Button
              type="button"
              buttonType="primary"
              text="Adicionar"
              onClick={() => {
                onChange(value, "add");
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({ icon, isActive = false, ...props }: ActionsProps) {
  return (
    <button
      type="button"
      {...props}
      className={`${styles.actionButton} ${isActive ? styles.active : ""}`}
    >
      {icon}
    </button>
  );
}
