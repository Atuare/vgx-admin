"use client";
import Image, { StaticImageData } from "next/image";
import styles from "./AdmProfile.module.scss";
import { ChevronDown } from "@/assets/Icons";
import { useState } from "react";
import { ProfileSelect } from "../ProfileSelect";

interface AdmProfileProps {
  name?: string;
  role?: string;
  image: StaticImageData;
}

export function AdmProfile({ name, role, image }: AdmProfileProps) {
  const [openSelect, setOpenSelect] = useState(false);

  return (
    <>
      <div className={styles.profile}>
        <Image alt={name || ""} src={image} width={48} height={48} />
        <div className={styles.profile__info}>
          <h3>{name}</h3>
          <p>{role}</p>
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
