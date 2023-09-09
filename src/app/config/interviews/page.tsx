import { AddCircle, SystemUpdate } from "@/assets/Icons";
import { Button } from "@/components/Button";
import styles from "./InterviewsConfig.module.scss";

export default function InterviewsConfigPage() {
  return (
    <div className={styles.interview}>
      <section className={styles.interview__actions}>
        <Button
          buttonType="secondary"
          text="Exportar dados"
          icon={<SystemUpdate />}
        />

        <Button
          buttonType="primary"
          text="Novo Agendamento"
          icon={<AddCircle />}
        />
      </section>
    </div>
  );
}
