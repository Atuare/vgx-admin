export interface IInterview {
  id: string;
  status: boolean;
  unitOrSite: string;
  type: "REMOTE" | "PERSON";
  limitTime: string;
  startDate: string;
  availableDays: number;
  endMessage: string;
  createdAt: string;
  updatedAt: string;
  schedulings: IScheduling[];
  dates: IDate[];
}

export interface IScheduling {
  id: string;
  date: string;
  schedulingLimit: number;
  dayOfWeek: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDate {
  id: string;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IInterviews {
  data: IInterview[];
  total: number;
}

export interface IGeneral {
  unitOrSite: {
    name: string;
    id: string;
  };
  type: {
    name: string;
    id: string;
  };
  limitTime: string;
  startDate: string;
  availableDays: number;
  endMessage: string;
}

export interface ISchedulingModal {
  date: string;
  schedulingLimit: number;
  dayOfWeek: string;
}

export interface IDateModal {
  date: string;
  description: string;
}

export interface ICreateInterview extends IGeneral {
  schedulings: IScheduling[];
  dates: IDate[];
}
