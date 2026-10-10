export interface Project {
  id: number;
  projectName: string;
  address: string;
  city?: string | null;
  description?: string | null;
  dateProject?: string | null;
  amount?: number | null;
  retentionsProject?: number | null;
  retentions?: number | null;
  sellerProject?: number | null;
  selle?: number | null;
  idCustomer: number;
  idSeller?: number | null;
  idProvide?: number | null;
  idTypeProject?: number | null;
  idTypeBuilding?: number | null;
  amountProvide?: number | null;
  inclusion?: string | null;
  ocip: string;
  status: number;
}

export interface VListProject {
  id: number;
  projectName: string;
  address: string;
  city?: string | null;
  description?: string | null;
  dateProject?: string | null;
  amount?: string | number | null;
  retentionsProject?: number | null;
  retentions?: string | number | null;
  sellerProject?: number | null;
  selle?: string | number | null;
  companyName?: string | null;
  nameSelle?: string | null;
  typeProjectDescription?: string | null;
  typeBuildingDescription?: string | null;
  amountProvide?: string | number | null;
  inclusion?: string | null;
  ocip?: string | null;
  status?: string | number | null;
}

export type ProjectFormData = Omit<Project, 'id'> & {
  id?: number;
};
