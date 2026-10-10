export interface Customer {
  id: number;
  companyName: string;
  address?: string | null;
  city?: string | null;
  zip?: string | null;
  phone?: string | null;
  status: boolean;
  email?: string | null;
}

export type CustomerFormData = Omit<Customer, 'id'> & {
  id?: number;
};
