export interface WorkOrder {
  id: number;
  clave: number;
  idProject: number;
  idCustomer: number;
  contact?: string | null;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  idAssigned: number;
  idProvider: number;
  description?: string | null;
  dateOrder: string;
  dateEnd: string;
  idType: number;
  idStatusWO: number;
  idStatusCalendario: number;
  idStatus: number;
}

export type WorkOrderFormData = Omit<WorkOrder, 'id'> & {
  id?: number;
};

export interface CommentsWO {
  id: number;
  description: string;
  idWorkOrder: number;
}

export interface WorkOrdersAssigned {
  id: number;
  idWorkOrder: number;
  idWorker: number;
}

export interface WorkOrdersOvertime {
  id: number;
  idWorkOrder: number;
  idProject: number;
  dateOvertime: string;
  hours: number;
}

export interface ChangeOrder {
  id: number;
  clave: number;
  dateChange: string;
  amount: number;
  idStatusCO: number;
  idWorkOrder: number;
  idProject: number;
  description?: string | null;
  user: string;
  status: boolean;
}
