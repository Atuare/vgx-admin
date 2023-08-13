"use client";
import dayjs from "dayjs";
import "../lib/dayjs";
import styles from "./Home.module.scss";
import { AdmProfile } from "@/components/AdmProfile";
import { HomeData } from "@/components/HomeData";
import Avatar from "@/assets/avatar.png";
import { Calendar } from "@/components/Calendar";
import { SearchInput } from "@/components/SearchInput";
import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState<string>("");
  const date = dayjs(new Date()).format("dddd, DD MMM YYYY");
  const actualDate = date.charAt(0).toUpperCase() + date.slice(1);

  function handleInputValue(value: string) {
    setValue(value);
  }

  return (
    <div className={styles.home}>
      <header className={styles.home__header}>
        <div className={styles.header__left}>
          <h1>Início</h1>
          <p>{actualDate}</p>
        </div>

        <div className={styles.header__right}>
          <SearchInput handleChangeValue={handleInputValue} />
          <AdmProfile image={Avatar} name="Nome perfil" role="Função" />
        </div>
      </header>

      <HomeData />
      <Calendar />
    </div>
  );
}
