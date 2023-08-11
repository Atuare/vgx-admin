import { ChevronDown } from "@/assets/Icons";
import styles from "./SettingsMenu.module.scss";
import { ReactNode } from "react";

interface SettingsMenuProps {
  title: string;
  active?: boolean;
  icon: ReactNode;
}

export function SettingsMenu({
  title,
  active = false,
  icon,
}: SettingsMenuProps) {
  return (
    <li className={`${styles.item} ${active ? styles.active : ""}`}>
      <button className={styles.item__button}>
        {icon}
        <p>{title}</p>
        <ChevronDown />
      </button>
    </li>
  );
}
