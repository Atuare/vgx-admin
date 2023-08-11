import Image from "next/image";
import styles from "./Login.module.scss";

import Logo from "@/assets/logo.png";
import Background from "@/assets/background.png";

import { Button } from "@/components/Button";

export default function Login() {
  return (
    <div className={styles.container}>
      <Image alt="background" src={Background} className={styles.background} />

      <div className={styles.form}>
        <Image alt="vgx logo" src={Logo} />
        <h2 className={styles.form__title}>Bem vindo(a)!</h2>

        <div className={styles.form__inputContainer}>
          <label htmlFor="user">Usuário</label>
          <input type="text" id="user" />
        </div>

        <div className={styles.form__inputContainer}>
          <label htmlFor="password">Senha</label>
          <input type="password" id="password" />
        </div>

        <Button text="ENTRAR" type="primary" />
      </div>
    </div>
  );
}
