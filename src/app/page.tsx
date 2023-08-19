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
import useUser from "@/hooks/useUser";
import { fetchApi } from "@/services/api/fetchApi";
import { useDispatch } from "react-redux";

export interface StatisticsType {
  onGoingProcesses: number;
  registeredCandidates: number;
  concludedProcesses: number;
}

const defaultStatistics: StatisticsType = {
  onGoingProcesses: 0,
  registeredCandidates: 0,
  concludedProcesses: 0,
};

export default function Home() {
  const { user } = useUser();
  const dispatch = useDispatch();

  const [value, setValue] = useState<string>("");
  const [statistics, setStatistics] =
    useState<StatisticsType>(defaultStatistics);

  const date = dayjs(new Date()).format("dddd, DD MMM YYYY");
  const actualDate = date.charAt(0).toUpperCase() + date.slice(1);

  function handleInputValue(value: string) {
    setValue(value);
  }

  async function handleToggleCalendarDate(startDate: string, endDate: string) {
    if (startDate.trim() && endDate.trim()) {
      const { data, isSuccess } = await dispatch<any>(
        fetchApi.endpoints.getAdminStatistics.initiate({ startDate, endDate }),
      );

      if (isSuccess) {
        setStatistics(data);
      }
    } else {
      setStatistics(defaultStatistics);
    }
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
          <AdmProfile
            image={Avatar}
            name={user?.employee?.name}
            role={user?.profile}
          />
        </div>
      </header>

      <HomeData statistics={statistics} />
      <Calendar handleToggleCalendarDate={handleToggleCalendarDate} />
    </div>
  );
}
