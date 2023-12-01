import { ProfileEnum } from "@/enums/profile.enum";

export interface IUser {
  id: string;
  password: string;
  profile: ProfileEnum.EMPLOYEE;
  firstAccess: boolean;
  passwordReset: string;
  createdAt: Date;
  updatedAt: Date;
  employee: {
    name: string;
    birthdate: Date;
    emailCompany: string;
    phone: string;
    whatsapp: string;
    emailPersonal: string;
    linkedin: string;
    facebook: string;
    instagram: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
