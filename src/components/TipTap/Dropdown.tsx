import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ChevronDown,
  Justify,
} from "@/assets/Icons";
import { Editor } from "@tiptap/react";
import { ReactNode, useEffect, useState } from "react";
import styles from "./TipTap.module.scss";

interface DropdownProps {
  options: { name: string; value: string; icon?: ReactNode }[];
  onChange: (value: string) => void;
  defaultValue: string;
  font?: boolean;
  listWidth?: string;
  icon?: boolean;
  height: string;
  editor: Editor;
}

export function DropDown({
  options,
  defaultValue,
  onChange,
  listWidth,
  font,
  icon,
  height,
  editor,
}: DropdownProps) {
  const [selected, setSelected] = useState<string>(defaultValue);
  const [open, setOpen] = useState<boolean>(false);

  const icons = {
    left: <AlignLeft />,
    right: <AlignRight />,
    center: <AlignCenter />,
    justify: <Justify />,
  };

  useEffect(() => {
    onChange(selected);
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    if (font) {
      options.map(option => {
        if (editor.isActive("textStyle", { fontFamily: option.value })) {
          setSelected(option.value);
        }
      });
    }

    if (!font) {
      options.map(option => {
        if (
          editor.isActive({ textAlign: option.value }) ||
          editor.isActive({ fontSize: option.value })
        ) {
          setSelected(option.value);
        }
      });
    }
  }, [editor.getJSON()]);

  return (
    <div className={styles.dropdown}>
      <button
        className={`${styles.dropdown__trigger} ${open ? styles.active : ""}`}
        onClick={() => setOpen(prev => !prev)}
        style={{
          fontFamily: font ? selected : "inherit",
        }}
      >
        <p>{icon ? icons[selected as keyof typeof icons] : selected}</p>
        <ChevronDown className={styles.chevrodown} />
      </button>
      {open && (
        <div
          className={styles.dropdown__list}
          style={{ width: listWidth, maxHeight: height }}
        >
          {options.map(option => (
            <button
              key={crypto.randomUUID()}
              onClick={() => {
                setSelected(option.value);
              }}
              style={{ fontFamily: font ? option.value : "inherit" }}
            >
              {icon && icons[option.value as keyof typeof icons]}
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Color({ color }: { color: string }) {
  return (
    <div style={{ background: color }} className={styles.color}>
      <div style={{ background: color, opacity: 0.7 }} />
    </div>
  );
}
