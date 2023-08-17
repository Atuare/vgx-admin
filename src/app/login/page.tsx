"use client";

import Image from "next/image";
import { SubmitHandler, FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/schemas/loginSchema";
import { useLoginMutation } from "@/services/api/authApi";

import styles from "./Login.module.scss";

import Logo from "@/assets/logo.png";
import Background from "@/assets/background.png";

import { Button } from "@/components/Button";
export type LoginInput = {
  username: string;
  password: string;
};

export default function Login() {
  const methods = useForm<LoginInput>({
    resolver: yupResolver(loginSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful },
    reset,
  } = methods;

  const [loginUser, { isLoading, isError, error, isSuccess }] =
    useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      redirect("/");
    }

    if (isError) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<LoginInput> = (data, event) => {
    event?.preventDefault();
    loginUser(data);
  };

  return (
    <div className={styles.container}>
      <Image alt="background" src={Background} className={styles.background} />

      <FormProvider {...methods}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)}>
          <Image alt="vgx logo" src={Logo} />
          <h2 className={styles.form__title}>Bem vindo(a)!</h2>

          <div className={styles.form__inputContainer}>
            <label htmlFor="user">Usuário</label>
            <input {...register("username")} type="text" id="user" />
          </div>

          <div className={styles.form__inputContainer}>
            <label htmlFor="password">Senha</label>
            <input {...register("password")} type="password" id="password" />
          </div>

          <Button
            onClick={() => handleSubmit(onSubmitHandler)}
            text="ENTRAR"
            buttonType="primary"
            type="submit"
          />
        </form>
      </FormProvider>
    </div>
  );
}
