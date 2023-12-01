import { StatusEnum } from "@/enums/status.enum";

export interface IRole {
  id: string;
  status: StatusEnum;
  roleText: string;
  roleDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoles {
  roles: IRole[];
  totalCount: number;
}
