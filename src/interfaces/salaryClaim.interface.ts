import { StatusEnum } from "@/enums/status.enum";

export interface ISalaryClaim {
  id: string;
  status: StatusEnum;
  fromAmount: string;
  toAmount: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISalaryClaims {
  salaryClaims: ISalaryClaim[];
  totalCount: number;
}
