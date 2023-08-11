import styles from "./MenuItem.module.scss";
import Link from "next/link";
import { ReactNode } from "react";

interface MenuItemProps {
  title: string;
  value: string;
  active?: boolean;
  icon: ReactNode;
}

export function MenuItem({
  title,
  active = false,
  icon,
  value,
}: MenuItemProps) {
  return (
    <li className={`${styles.item} ${active ? styles.active : ""}`}>
      <Link href={value}>
        <button className={styles.item__button}>
          {icon}
          <p>{title}</p>
        </button>
      </Link>
    </li>
  );
}
