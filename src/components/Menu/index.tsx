"use client";

import { usePathname } from "next/navigation";
import styles from "./Menu.module.scss";
import Image from "next/image";
import Logo from "@/assets/logo.svg";

import {
  Badge,
  ContentPaste,
  HeadsetMic,
  HomeIcon,
  Hospital,
  MenuCheck,
  MenuProcess,
  Profile,
  Settings,
} from "@/assets/Icons";
import { MenuItem } from "../MenuItem";
import { SettingsMenu } from "../SettingsMenu";

const menuItems = [
  {
    name: "Inicío",
    value: "/",
    icon: <HomeIcon />,
  },
  {
    name: "Processos",
    value: "/process",
    icon: <MenuProcess />,
  },
  {
    name: "Candidatos",
    value: "/candidates",
    icon: <Badge />,
  },
  {
    name: "Documentos",
    value: "/documents",
    icon: <MenuCheck />,
  },
  {
    name: "Entrevistas",
    value: "/interviews",
    icon: <HeadsetMic />,
  },
  {
    name: "Treinamentos",
    value: "/trainings",
    icon: <ContentPaste />,
  },
  {
    name: "Exames admissionais",
    value: "/admission-exams",
    icon: <Hospital />,
  },
  {
    name: "Adimissões",
    value: "/admissions",
    icon: <Profile />,
  },
];

export function Menu() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Image alt="vgx logo" src={Logo} />

      <nav className={styles.menu}>
        <h2 className={styles.sidebar__title}>Menu</h2>
        <ul className={styles.menu__list}>
          {menuItems.map(item => (
            <MenuItem
              icon={item.icon}
              title={item.name}
              value={item.value}
              active={pathname === item.value}
              key={crypto.randomUUID()}
            />
          ))}
          <SettingsMenu
            icon={<Settings />}
            title="Configurações"
            active={pathname.includes("/settings")}
          />
        </ul>
      </nav>
    </aside>
  );
}
