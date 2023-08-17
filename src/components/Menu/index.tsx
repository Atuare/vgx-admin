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
import { configItems } from "@/utils/sidebar";

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
    name: "Exames Admissionais",
    value: "/admission-exams",
    icon: <Hospital />,
  },
  {
    name: "Admissões",
    value: "/admissions",
    icon: <Profile />,
  },
];

export function Menu() {
  const pathname = usePathname();
  const pathnameFiltered = pathname.split("/").slice(0, 2).join("/");

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__logo}>
        <Image alt="vgx logo" src={Logo} />
      </div>

      <nav className={styles.menu}>
        <h2 className={styles.sidebar__title}>Menu</h2>
        <ul className={styles.menu__list}>
          {menuItems.map((item, index) => (
            <MenuItem
              icon={item.icon}
              title={item.name}
              value={item.value}
              active={pathnameFiltered === item.value}
              key={crypto.randomUUID()}
              index={index}
            />
          ))}

          <SettingsMenu
            icon={<Settings />}
            title="Configurações"
            active={pathnameFiltered === "/config"}
          />
        </ul>
      </nav>
    </aside>
  );
}
