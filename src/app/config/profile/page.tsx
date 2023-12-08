"use client";

import { Facebook, Instagram, LinkedIn, TaskAlt } from "@/assets/Icons";
import Placeholder from "@/assets/placeholder.png";
import { Button } from "@/components/Button";
import { PasswordInput } from "@/components/PasswordInput";
import useUser from "@/hooks/useUser";
import { editProfileSchema } from "@/schemas/editProfileSchema";
import {
  useChangeEmployeePasswordMutation,
  useUpdateUserMutation,
} from "@/services/api/fetchApi";
import { getBase64 } from "@/utils/getBase64";
import { formatPhoneNumber } from "@/utils/phoneFormating";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Image from "next/image";
import { ChangeEvent, InputHTMLAttributes, ReactNode, useState } from "react";
import { Control, Controller, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Profile.module.scss";

dayjs.extend(utc);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  width?: string;
  defaultValue?: string;
  icon?: ReactNode;
  id: string;
  control: Control<any>;
}

interface YupDataType {
  phone: string;
  whatsapp: string;
  emailPersonal: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Profile() {
  const [picture, setPicture] = useState<File>();
  const [base64Picture, setBase64Picture] = useState<string>();
  const [updateUser] = useUpdateUserMutation();
  const [changeEmployeePassword] = useChangeEmployeePasswordMutation();

  const { user } = useUser();

  const { handleSubmit, control } = useForm({
    resolver: zodResolver(editProfileSchema),
  });

  const handleEditProfile = async (data: Partial<YupDataType>) => {
    const { currentPassword, newPassword, confirmPassword, ...rest } = data;

    updateUser({ ...rest, image: base64Picture }).then(() => {
      toast.success("Perfil atualizado com sucesso!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
        pauseOnHover: false,
        theme: "light",
      });
    });

    if (currentPassword && newPassword) {
      changeEmployeePassword({ password: currentPassword, newPassword }).then(
        (e: any) => {
          if (e?.error?.data?.data?.error?.[0]) {
            toast.error(e?.error?.data?.data?.error?.[0], {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              progress: undefined,
              pauseOnHover: false,
              theme: "light",
            });
          } else {
            toast.success("Senha alterada com sucesso!", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              progress: undefined,
              pauseOnHover: false,
              theme: "light",
            });
          }
        },
      );
    }
  };

  const handlePictureChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const type = file.type;
    const size = file.size;

    if (type !== "image/png" && type !== "image/jpeg" && type !== "image/jpg") {
      toast.error("O arquivo deve ser uma imagem png, jpg ou jpeg.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
        pauseOnHover: false,
        theme: "light",
      });

      event.target.value = "";
      return;
    }

    if (size > 5000000) {
      toast.error("O arquivo deve ter no máximo 5MB.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
        pauseOnHover: false,
        theme: "light",
      });

      event.target.value = "";
      return;
    }

    const base64File: any = await getBase64(file);

    setBase64Picture(base64File);
    setPicture(file);
  };

  if (!user) return;

  return (
    <form className={styles.profile} onSubmit={handleSubmit(handleEditProfile)}>
      <section className={styles.profile__hero}>
        <div className={styles.profile__hero__left}>
          <Image
            src={
              picture
                ? URL.createObjectURL(picture)
                : user?.employee?.image
                  ? user?.employee.image
                  : Placeholder
            }
            alt="Avatar"
            width={133}
            height={133}
          />

          <div className={styles.profile__hero__left__input}>
            <input
              type="file"
              id="file"
              onChange={handlePictureChange}
              accept=".png, .jpg, .jpeg"
            />
            <label htmlFor="file">Escolher foto</label>
          </div>
        </div>

        <div className={styles.profile__hero__right}>
          <h1>{user.employee.name}</h1>
          <p>{user.profile}</p>
        </div>
      </section>

      <section className={styles.profile__personalInfo}>
        <h1>Informações pessoais</h1>
        <div className={styles.profile__personalInfo__list}>
          <div className={styles.profile__personalInfo__list__disabled}>
            <DisabledInput name="Nome" defaultValue={user.employee.name} />
            <DisabledInput
              name="Data de nascimento"
              defaultValue={
                user.employee.birthdate &&
                dayjs(user.employee.birthdate).utc().format("DD/MM/YYYY")
              }
            />
            <DisabledInput
              name="E-mail institucional"
              defaultValue={user.employee.emailCompany}
            />
          </div>
          <div className={styles.profile__personalInfo__list__active}>
            <PhoneInput
              control={control}
              defaultValue={user.employee.phone}
              id="phone"
              name="Telefone"
            />
            <PhoneInput
              control={control}
              defaultValue={user.employee.whatsapp}
              id="whatsapp"
              name="Whatsapp"
            />
            <Input
              name="E-mail pessoal"
              type="text"
              defaultValue={user.employee.emailPersonal}
              id="emailPersonal"
              control={control}
            />
            <Input
              name="LinkedIn"
              type="text"
              icon={<LinkedIn />}
              defaultValue={user.employee.linkedin}
              id="linkedin"
              control={control}
            />
            <Input
              name="Facebook"
              type="text"
              icon={<Facebook />}
              defaultValue={user.employee.facebook}
              id="facebook"
              control={control}
            />
            <Input
              name="Instagram"
              type="text"
              icon={<Instagram />}
              defaultValue={user.employee.instagram}
              id="instagram"
              control={control}
            />
          </div>
        </div>
      </section>

      <section className={styles.profile__password}>
        <h1>Alterar senha</h1>
        <div className={styles.profile__password__list}>
          <Controller
            name="currentPassword"
            control={control}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <PasswordInput
                name="Senha atual"
                onChangePassword={onChange}
                error={error?.message}
              />
            )}
          />

          <Controller
            name="newPassword"
            control={control}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <PasswordInput
                name="Nova senha"
                onChangePassword={onChange}
                error={error?.message}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <PasswordInput
                name="Confirmar nova senha"
                onChangePassword={onChange}
                error={error?.message}
              />
            )}
          />
        </div>
      </section>

      <div className={styles.profile__saveChanges}>
        <Button
          buttonType="primary"
          text="Salvar alterações"
          icon={<TaskAlt />}
          type="submit"
        />
      </div>
      <ToastContainer />
    </form>
  );
}

function Input({
  name,
  width,
  defaultValue,
  icon,
  control,
  id,
  ...props
}: InputProps) {
  return (
    <Controller
      name={id}
      control={control}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <div className={styles.input}>
          <label htmlFor={id}>
            {icon && icon} {name}
          </label>
          <input
            id={id}
            defaultValue={defaultValue}
            onChange={onChange}
            type="text"
            {...props}
          />
          <span className={styles.error}>{error?.message}</span>
        </div>
      )}
    />
  );
}

function DisabledInput({
  name,
  width,
  defaultValue,
}: {
  name: string;
  width?: string;
  defaultValue: string;
}) {
  return (
    <div className={styles.input} style={{ width }}>
      <label htmlFor={name}>{name}</label>
      <input type="text" id={name} defaultValue={defaultValue} disabled />
    </div>
  );
}

function PhoneInput({
  name,
  defaultValue,
  control,
  id,
}: {
  name: string;
  defaultValue: string;
  control: Control<any>;
  id: string;
}) {
  const [phoneNumber, setPhoneNumber] = useState(
    defaultValue ? formatPhoneNumber(defaultValue) : "",
  );

  const handleInputChange = (value: string) => {
    const number = formatPhoneNumber(value);

    setPhoneNumber(number);
  };

  return (
    <Controller
      name={id}
      control={control}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <div className={styles.input}>
          <label htmlFor={id}>{name}</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={event => {
              onChange(
                event.target.value.replace(/\D/g, "").length === 14
                  ? event.target.value.replace(/\D/g, "").slice(0, 13)
                  : event.target.value.replace(/\D/g, ""),
              );
              handleInputChange(event.target.value);
            }}
          />
          <span className={styles.error}>{error?.message}</span>
        </div>
      )}
    />
  );
}
