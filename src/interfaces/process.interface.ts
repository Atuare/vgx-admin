export interface ProcessType {
  id: number;
  type: "PRESENCIAL" | "REMOTO";
  unit: {
    id: number;
    unitName: string;
    unitAcronym: string;
    unitAddress: string;
    status: "ATIVO" | "INATIVO";
  };
  role: {
    id: string;
    roleText: string;
    roleDescription: string;
    status: "ATIVO" | "INATIVO";
  };
  status: "ATIVO" | "INATIVO";
  skills: [
    {
      id: number;
      skillText: string;
      status: "ATIVO" | "INATIVO";
    },
  ];
  availabilities: [
    {
      id: string;
      status: "ATIVO" | "INATIVO";
      startDay: number;
      endDay: number;
      startHour: number;
      endHour: number;
    },
  ];
  schoolings: [
    {
      id: number;
      status: "ATIVO" | "INATIVO";
      schoolingName: string;
      informCourse: boolean;
    },
  ];
  benefits: [
    {
      id: string;
      benefitName: string;
    },
  ];
  limitCandidates: number;
  startDate: string;
  endDate: string;
  requestCv: boolean;
  availableForMinors: boolean;
  observations: string;
  registrationCompletionMessage: string;
  createdAt: string;
  updatedAt: string;
  banner: string;
}

export interface ProcessesType {
  processes: ProcessType[];
  totalCount: number;
}

export interface UnitsType {
  units: {
    id: number;
    unitName: string;
    unitAcronym: string;
    unitAddress: string;
    status: "ATIVO" | "INATIVO";
  }[];
  totalCount: number;
}

export interface RolesType {
  roles: {
    id: string;
    roleText: string;
    roleDescription: string;
    status: "ATIVO" | "INATIVO";
  }[];
  totalCount: number;
}
