import { CheckRounded, ChevronDown } from "@/assets/Icons";
import { hexToRGB } from "@/utils/hexToRgba";
import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import styles from "./TipTap.module.scss";

interface ColorDropdownProps {
  options: { name: string; value: string }[];
  onChange: (value: string) => void;
  defaultValue: string;
  editor: Editor;
}

export function ColorDropDown({
  options,
  defaultValue,
  onChange,
  editor,
}: ColorDropdownProps) {
  const [selected, setSelected] = useState<string>(defaultValue);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    onChange(selected);
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    options.map(option => {
      if (editor?.isActive("textStyle", { color: option.value })) {
        setSelected(option.value);
      }
    });
  }, [editor?.getJSON()]);

  return (
    <div className={styles.dropdown}>
      <button
        type="button"
        className={`${styles.dropdown__trigger} ${open ? styles.active : ""}`}
        onClick={e => setOpen(prev => !prev)}
      >
        <Color color={selected} />
        <ChevronDown className={styles.chevrodown} />
      </button>
      {open && (
        <div className={styles.colorDropdown__list}>
          {options.map(option => (
            <button
              type="button"
              key={crypto.randomUUID()}
              onClick={e => setSelected(option.value)}
            >
              <Color
                color={option.value}
                isActive={option.value === selected}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Color({ color, isActive }: { color: string; isActive?: boolean }) {
  return (
    <div
      style={{ background: hexToRGB(color, 0.7), borderColor: color }}
      className={`${styles.color} ${isActive ? styles.active : ""}`}
    >
      {isActive && <CheckRounded />}
    </div>
  );
}
