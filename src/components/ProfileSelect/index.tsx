import { Logout, Person } from "@/assets/Icons";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import styles from "./ProfileSelect.module.scss";

export function ProfileSelect() {
  const { handleLogout } = useAuth();

  return (
    <div className={styles.select}>
      <Link className={styles.select__item} href="/config/profile">
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
