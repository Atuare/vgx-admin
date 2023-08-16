import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "@/assets/Icons";
import { configItems } from "@/utils/sidebar";
import styles from "./SettingsMenu.module.scss";

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
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <div className={styles.settingsMenu}>
      <li>
        <button
          className={`${styles.item} ${active ? styles.active : ""} ${
            openDropdown ? styles.dropdown : ""
          }`}
          onClick={() => setOpenDropdown(prev => !prev)}
        >
          {icon}
          <p>{title}</p>
          <ChevronDown />
        </button>
      </li>
      {openDropdown && (
        <div className={styles.item__dropdown}>
          <div className={styles.item__dropdown__border} />
          <ul className={styles.item__dropdown__list}>
            {configItems.map(item => (
              <li
                className={`${
                  pathname.includes(item.path) ? styles.active : ""
                }`}
                key={crypto.randomUUID()}
              >
                <Link href={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
