import { ReactNode } from "react";
import { ClearAll, FilterList, Groups } from "@/assets/Icons";
import styles from "./HomeData.module.scss";

export function HomeData() {
  return (
    <div className={styles.data}>
      <HomeDataItem
        title="Processos em andamento"
        value={30}
        icon={<FilterList />}
      />
      <HomeDataItem
        title="Candidatos inscritos"
        value={1234}
        icon={<Groups />}
      />
      <HomeDataItem
        title="Processos realizados"
        value={20}
        icon={<ClearAll />}
      />
    </div>
  );
}

function HomeDataItem({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className={styles.item}>
      <div className={styles.item__text}>
        <h1>{value}</h1>
        <p>{title}</p>
      </div>
      <div className={styles.item__icon}>{icon}</div>
    </div>
  );
}
