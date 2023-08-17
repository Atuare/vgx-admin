import { ReactNode } from "react";
import { Select } from "../Select";
import styles from "./StepOne.module.scss";
import { TipTap } from "../TipTap";

const unitOptions = ["Unidade 1", "Unidade 2", "Unidade 3"];

export function StepOne() {
  return (
    <div className={styles.container}>
      {/* <section className={styles.container__form}>
        <div>
          <DataInput name="Unidade/Site" required width="296px">
            <Select placeholder="Selecione os locais" options={unitOptions} />
          </DataInput>
        </div>
      </section> */}
      <section>
        <TipTap />
      </section>
    </div>
  );
}

function DataInput({
  name,
  width,
  required = false,
  children,
}: {
  name: string;
  width?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={styles.dataInput} style={{ width }}>
      <label htmlFor={name}>
        {name}
        {required && <span>*</span>}
      </label>
      {children}
    </div>
  );
}
