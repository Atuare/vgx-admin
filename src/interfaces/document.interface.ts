export interface IDocument {
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

export interface IDocuments {
  documents: IDocument[];
  totalCount: number;
}
