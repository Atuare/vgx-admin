"use client";

import { ReactNode } from "react";
import { ClearAll, FilterList, Groups } from "@/assets/Icons";
import styles from "./HomeData.module.scss";
import { StatisticsType } from "@/app/page";

interface HomeDataProps {
  statistics: StatisticsType;
}

export function HomeData({ statistics }: HomeDataProps) {
  if (!statistics) return;

  return (
    <div className={styles.data}>
      <HomeDataItem
        title="Processos em andamento"
        value={statistics.onGoingProcesses}
        icon={<FilterList />}
      />
      <HomeDataItem
        title="Candidatos inscritos"
        value={statistics.registeredCandidates}
        icon={<Groups />}
      />
      <HomeDataItem
        title="Processos realizados"
        value={statistics.concludedProcesses}
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
