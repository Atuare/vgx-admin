export interface ICandidate {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: any;
  whatsapp: string;
  birthdate: string;
  firstAccess: boolean;
  notifyEmail: boolean;
  notifyWhats: boolean;
  acceptTerms: boolean;
  gender: any;
  civilStatus: any;
  state: any;
  county: any;
  motherName: any;
  fatherName: any;
  childUnderfourteen: boolean;
  childCount: any;
  curriculum: any;
  createdAt: string;
  updatedAt: string;
}

export interface ICandidates {
  data: ICandidate[];
  total: number;
  page: number;
  items: number;
}
