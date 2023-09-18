export interface UserDocumentType {
  id: string;
  identity: {
    rg: string;
    identityShippingDate: string;
    federalUnit: string;
    uf: string;
    createdAt: string;
    updatedAt: string;
  };
  work: {
    ctps: string;
    pis: string;
    shippingDate: string;
    serie: string;
    uf: string;
    createdAt: string;
    updatedAt: string;
  };
  bank: {
    bank: string;
    agency: string;
    account: string;
    pixKeyType: string;
    pixKey: string;
    createdAt: string;
    updatedAt: string;
  };
}
