import Link from "next/link";
import { Logout, Person } from "@/assets/Icons";
import styles from "./ProfileSelect.module.scss";
import { useAuth } from "@/hooks/useAuth";

export function ProfileSelect() {
  const { handleLogout } = useAuth();

  return (
    <div className={styles.select}>
      <Link className={styles.select__item} href="/profile">
        <Person />
        <p>Meu perfil</p>
      </Link>
      <button onClick={handleLogout} className={styles.select__item}>
        <Logout />
        <p>Sair</p>
      </button>
    </div>
  );
}
