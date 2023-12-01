import styles from "./LoadingIcon.module.scss";
import { Logo } from "@/assets/Icons";

export default function LoadingIcon() {
  return (
    <div className={styles.loadingIcon}>
      <div className={styles.loadingIcon__icon}>
        <Logo />
      </div>
    </div>
  );
}
