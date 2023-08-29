"use client";
import { ChevronDown } from "@/assets/Icons";
import Placeholder from "@/assets/placeholder.png";
import useUser from "@/hooks/useUser";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import { ProfileSelect } from "../ProfileSelect";
import styles from "./AdmProfile.module.scss";

interface AdmProfileProps {
  name?: string;
  role?: string;
  image: StaticImageData | string;
}

export function AdmProfile() {
  const [openSelect, setOpenSelect] = useState(false);

  const { user } = useUser();

  return (
    <>
      <div className={styles.profile}>
        <Image
          alt="perfil"
          src={user?.employee?.image ? user?.employee.image : Placeholder}
          width={48}
          height={48}
        />
        <div className={styles.profile__info}>
          <h3>{user?.employee?.name}</h3>
          <p>{user?.profile}</p>
        </div>
        <ChevronDown
          onClick={() => setOpenSelect(prev => !prev)}
          className={`${openSelect ? styles.active : ""}`}
        />
        {openSelect && <ProfileSelect />}
      </div>
    </>
  );
}
