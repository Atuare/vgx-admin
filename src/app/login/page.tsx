"use client";

import { loginSchema } from "@/schemas/loginSchema";
import { useLoginMutation } from "@/services/api/authApi";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import "react-toastify/dist/ReactToastify.css";
import styles from "./Login.module.scss";

import Background from "@/assets/background.png";
import Logo from "@/assets/logo.png";

import { TaskAlt } from "@/assets/Icons";
import { Button } from "@/components/Button";
import { PasswordInput } from "@/components/PasswordInput";
import { useRouter } from "next/navigation";
import ReactLoading from "react-loading";
import { ToastContainer, toast } from "react-toastify";
export type LoginInput = {
  username: string;
  password: string;
};

export default function Login() {
  const [loading, setLoading] = useState(false);

  const { push } = useRouter();

  const methods = useForm<LoginInput>({
    resolver: yupResolver(loginSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [loginUser, { isLoading, isError, error, isSuccess }] =
    useLoginMutation();

  useEffect(() => {
    if (isLoading) setLoading(true);

    if (isSuccess) {
      setLoading(false);

      setTimeout(() => {
        push("/");
      }, 300);
    }

    if (isError && error && "status" in error) {
      toast.error(error.data.data.error[0], {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const onSubmitHandler: SubmitHandler<LoginInput> = data => {
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
          <span className={styles.error}>{errors.username?.message}</span>

          <Controller
            name="password"
            control={methods.control}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <PasswordInput
                name="Senha"
                onChangePassword={onChange}
                error={error?.message}
              />
            )}
          />

          {isSuccess ? (
            <Button text="" buttonType="primary" disabled icon={<TaskAlt />} />
          ) : loading ? (
            <Button
              text=""
              buttonType="primary"
              disabled
              icon={
                <ReactLoading
                  type="spin"
                  color="#001866"
                  height={"5%"}
                  width={"5%"}
                />
              }
            />
          ) : (
            <Button
              onClick={() => handleSubmit(onSubmitHandler)}
              text="ENTRAR"
              buttonType="primary"
              type="submit"
            />
          )}
        </form>
        <ToastContainer />
      </FormProvider>
    </div>
  );
}
