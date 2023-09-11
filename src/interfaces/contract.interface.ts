export interface IContract {
  id: string;
  name: string;
  description: string;
  status: string;
  document: string;
  transportVoucher: boolean;
  hasChilds: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IContracts {
  contracts: IContract[];
  totalCount: number;
}
