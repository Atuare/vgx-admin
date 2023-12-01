import styles from "./MenuItem.module.scss";
import Link from "next/link";
import { ReactNode } from "react";

interface MenuItemProps {
  title: string;
  value: string;
  active?: boolean;
  icon: ReactNode;
  index: number;
}

export function MenuItem({
  title,
  active = false,
  icon,
  value,
  index,
}: MenuItemProps) {
  return (
    <li>
      <Link href={value}>
        <button className={`${styles.item} ${active ? styles.active : ""}`}>
          {icon}
          <p style={{ alignSelf: index === 6 ? "flex-start" : "flex-end" }}>
            {title}
          </p>
        </button>
      </Link>
    </li>
  );
}
