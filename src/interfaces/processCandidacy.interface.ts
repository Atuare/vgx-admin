export interface IProcessCandidacy {
  id: string;
  cpf: string;
  name: string;
  whatsapp: string;
  role: string;
  availabilities: string;
  unit: string;
}

export interface IProcessesCandidacy {
  candidacy: IProcessCandidacy[];
}
