import dayjs from "dayjs";
import "../lib/dayjs";
import styles from "./Home.module.scss";
import { AdmProfile } from "@/components/AdmProfile";
import { HomeData } from "@/components/HomeData";
import Avatar from "@/assets/avatar.png";

export default function Home() {
  const date = dayjs(new Date()).format("dddd, DD MMM YYYY");
  const actualDate = date.charAt(0).toUpperCase() + date.slice(1);

  return (
    <div className={styles.home}>
      <header className={styles.home__header}>
        <div className={styles.header__left}>
          <h1>Início</h1>
          <p>{actualDate}</p>
        </div>

        <div className={styles.header__right}>
          <input type="search" placeholder="Pesquisar..." />
          <AdmProfile image={Avatar} name="Nome perfil" role="Função" />
        </div>
      </header>

      <HomeData />
    </div>
  );
}
