import Link from "next/link";
import { Logout, Person } from "@/assets/Icons";
import styles from "./ProfileSelect.module.scss";

export function ProfileSelect() {
  return (
    <div className={styles.select}>
      <Link className={styles.select__item} href="/profile">
        <Person />
        <p>Meu perfil</p>
      </Link>
      <button className={styles.select__item}>
        <Logout />
        <p>Sair</p>
      </button>
    </div>
  );
}
