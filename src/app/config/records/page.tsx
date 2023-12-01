"use client";
import { Select } from "@/components/Select";
import { AvailabilityTable } from "@/components/Tables/Config/Records/AvailabilityTable";
import { RoleTable } from "@/components/Tables/Config/Records/RoleTable";
import { SalaryClaimTable } from "@/components/Tables/Config/Records/SalaryClaimTable";
import { SchoolingTable } from "@/components/Tables/Config/Records/SchoolingTable";
import { SkillTable } from "@/components/Tables/Config/Records/SkillTable";
import { UnitTable } from "@/components/Tables/Config/Records/UnitTable";
import { useTableParams } from "@/hooks/useTableParams";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import styles from "./Records.module.scss";

const size = 5;

const dataPropertys = [
  "units",
  "roles",
  "skills",
  "salaryClaims",
  "availabilities",
  "schoolings",
];

const items = [
  { name: "Unidade/Site", id: "Unidade/Site" },
  { name: "Cargos", id: "Cargos" },
  {
    name: "Habilidades",
    id: "Habilidades",
  },
  {
    name: "Pretensão salarial",
    id: "Pretensão salarial",
  },
  {
    name: "Disponibilidades",
    id: "Disponibilidades",
  },
  {
    name: "Escolaridade",
    id: "Escolaridade",
  },
];

export default function Records() {
  const { setParams } = useTableParams();
  const { get } = useSearchParams();
  const [type, setType] = useState(
    get("screen") ? dataPropertys.indexOf(String(get("screen"))) : 0,
  );

  const handleChangeSelect = (value: { name: string; id: string }) => {
    items.map((item, index) => {
      if (item.id === value.id) setType(index);
    });
  };

  useEffect(() => {
    (type >= 0 || type <= 5) && setParams("screen", dataPropertys[type]);
  }, [type]);

  useEffect(() => {
    if (!get("screen")) setParams("screen", "units");
  }, []);

  if (type < 0 || type > 5) return <div>Categoria não encontrada</div>;

  return (
    <div className={styles.records}>
      <Select
        placeholder={items[type].name}
        options={items}
        onChange={handleChangeSelect}
        defaultValue={items[type].id}
        width="296px"
      />
      <Tables type={type} />
      <ToastContainer />
    </div>
  );
}

function Tables({ type }: { type: number }) {
  switch (type) {
    case 0:
      return <UnitTable defaultTableSize={size} type={type} />;
    case 1:
      return <RoleTable defaultTableSize={size} type={type} />;
    case 2:
      return <SkillTable defaultTableSize={size} type={type} />;
    case 3:
      return <SalaryClaimTable defaultTableSize={size} type={type} />;
    case 4:
      return <AvailabilityTable defaultTableSize={size} type={type} />;
    case 5:
      return <SchoolingTable defaultTableSize={size} type={type} />;
    default:
      return <div>Categoria não encontrada</div>;
  }
}
