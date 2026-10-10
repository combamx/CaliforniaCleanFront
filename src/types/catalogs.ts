export interface Worker {
  id: number;
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  status: number;
}

export interface Provider {
  id: number;
  name: string;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  zip?: number | null;
  phone?: string | null;
  status: number;
}

export interface Seller {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: number;
}

export interface Building {
  id: number;
  description: string;
  idTypeProject: number;
  order: number;
}

export interface StatusProject {
  id: number;
  description: string;
  order: number;
}

export interface StatusWorkOrder {
  id: number;
  description: string;
  order: number;
}

export interface StatusDate {
  id: number;
  description: string;
  order: number;
}

export interface TypesProject {
  id: number;
  description: string;
}

export interface TypesOrderWork {
  id: number;
  description: string;
}
