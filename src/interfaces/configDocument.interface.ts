export interface IConfigDocument {
  id: string;
  name: string;
  mandatory: boolean;
  man: boolean;
  eighteenYears: boolean;
  married: boolean;
  childrens: boolean;
  status: string;
  updatedAt: string;
  createdAt: string;
}

export interface IConfigDocuments {
  documents: IConfigDocument[];
  totalCount: number;
}
