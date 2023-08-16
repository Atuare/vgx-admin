"use client";

import { ReactNode, useEffect, useState } from "react";
import { ClearAll, FilterList, Groups } from "@/assets/Icons";
import styles from "./HomeData.module.scss";
import { getAdminStatistics } from "@/utils/statistics";

interface StatisticsType {
  ongGoingProcess: number;
  registeredCandidates: number;
  concludedProcesses: number;
}

interface HomeDataProps {
  calendarDates: {
    startDate: string;
    endDate: string;
  } | null;
}

export function HomeData({ calendarDates }: HomeDataProps) {
  const [statistics, setStatistics] = useState<StatisticsType>();

  useEffect(() => {
    if (calendarDates) {
      getAdminStatistics(calendarDates.startDate, calendarDates.endDate).then(
        ({ data }) => {
          setStatistics({
            ongGoingProcess: data.onGoingProcesses,
            registeredCandidates: data.registeredCandidates,
            concludedProcesses: data.concludedProcesses,
          });
        },
      );
    } else {
      setStatistics({
        ongGoingProcess: 0,
        registeredCandidates: 0,
        concludedProcesses: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarDates]);

  if (!statistics) return;

  return (
    <div className={styles.data}>
      <HomeDataItem
        title="Processos em andamento"
        value={statistics.ongGoingProcess}
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
