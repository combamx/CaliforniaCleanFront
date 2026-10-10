import React, { useState, useEffect } from 'react';
import type { WorkOrder, WorkOrderFormData } from '@/types/workOrder';
import type { Project } from '@/types/project';
import type { Customer } from '@/types/customer';
import type { Worker, Provider, TypesOrderWork, StatusWorkOrder, StatusDate } from '@/types/catalogs';
import { workOrderService } from '@/services/workOrderService';
import { projectService } from '@/services/projectService';
import { customerService } from '@/services/customerService';
import { catalogService } from '@/services/catalogService';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';

interface WorkOrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  workOrder?: WorkOrder | null;
}

export const WorkOrderFormModal: React.FC<WorkOrderFormModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  workOrder,
}) => {
  const [formData, setFormData] = useState<WorkOrderFormData>({
    clave: Math.floor(1000 + Math.random() * 9000),
    idProject: 0,
    idCustomer: 0,
    contact: '',
    address: '',
    city: '',
    phone: '',
    idAssigned: 0,
    idProvider: 0,
    description: '',
    dateOrder: new Date().toISOString().split('T')[0],
    dateEnd: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    idType: 1,
    idStatusWO: 1,
    idStatusCalendario: 1,
    idStatus: 1,
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [typesWO, setTypesWO] = useState<TypesOrderWork[]>([]);
  const [statusWO, setStatusWO] = useState<StatusWorkOrder[]>([]);
  const [statusDate, setStatusDate] = useState<StatusDate[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalogs() {
      try {
        const [projRes, custRes, workRes, provRes, typeRes, sWoRes, sDtRes] =
          await Promise.allSettled([
            projectService.getProjects({ pageSize: 100 }),
            customerService.getAll({ pageSize: 100 }),
            catalogService.getWorkers({ pageSize: 100 }),
            catalogService.getProviders({ pageSize: 100 }),
            catalogService.getTypesOrderWorks(),
            catalogService.getStatusWorkOrders(),
            catalogService.getStatusDates(),
          ]);

        if (projRes.status === 'fulfilled') setProjects(projRes.value.data);
        if (custRes.status === 'fulfilled') setCustomers(custRes.value.data);
        if (workRes.status === 'fulfilled') setWorkers(workRes.value.data);
        if (provRes.status === 'fulfilled') setProviders(provRes.value.data);
        if (typeRes.status === 'fulfilled') setTypesWO(typeRes.value);
        if (sWoRes.status === 'fulfilled') setStatusWO(sWoRes.value);
        if (sDtRes.status === 'fulfilled') setStatusDate(sDtRes.value);
      } catch (e) {
        console.error('Error loading catalogs for Work Order', e);
      }
    }

    if (isOpen) {
      loadCatalogs();
    }
  }, [isOpen]);

  useEffect(() => {
    if (workOrder) {
      setFormData({
        id: workOrder.id,
        clave: workOrder.clave || 1001,
        idProject: workOrder.idProject || 0,
        idCustomer: workOrder.idCustomer || 0,
        contact: workOrder.contact || '',
        address: workOrder.address || '',
        city: workOrder.city || '',
        phone: workOrder.phone || '',
        idAssigned: workOrder.idAssigned || 0,
        idProvider: workOrder.idProvider || 0,
        description: workOrder.description || '',
        dateOrder: workOrder.dateOrder ? workOrder.dateOrder.split('T')[0] : '',
        dateEnd: workOrder.dateEnd ? workOrder.dateEnd.split('T')[0] : '',
        idType: workOrder.idType || 1,
        idStatusWO: workOrder.idStatusWO || 1,
        idStatusCalendario: workOrder.idStatusCalendario || 1,
        idStatus: workOrder.idStatus || 1,
      });
    } else {
      setFormData({
        clave: Math.floor(1000 + Math.random() * 9000),
        idProject: projects[0]?.id || 0,
        idCustomer: customers[0]?.id || 0,
        contact: '',
        address: '',
        city: '',
        phone: '',
        idAssigned: workers[0]?.id || 0,
        idProvider: providers[0]?.id || 0,
        description: '',
        dateOrder: new Date().toISOString().split('T')[0],
        dateEnd: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        idType: typesWO[0]?.id || 1,
        idStatusWO: statusWO[0]?.id || 1,
        idStatusCalendario: statusDate[0]?.id || 1,
        idStatus: 1,
      });
    }
    setError(null);
  }, [workOrder, isOpen, projects, customers, workers, providers, typesWO, statusWO, statusDate]);

  // When project changes, optionally pre-fill customer and address
  const handleProjectChange = (projectId: number) => {
    const selProj = projects.find((p) => p.id === projectId);
    setFormData((prev) => ({
      ...prev,
      idProject: projectId,
      idCustomer: selProj?.idCustomer || prev.idCustomer,
      address: selProj?.address || prev.address,
      city: selProj?.city || prev.city,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.idProject || !formData.idCustomer || !formData.idAssigned || !formData.idProvider) {
      setError('Por favor selecciona Proyecto, Cliente, Responsable y Proveedor.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      if (workOrder && workOrder.id) {
        await workOrderService.update(workOrder.id, {
          ...formData,
          id: workOrder.id,
        } as WorkOrder);
      } else {
        await workOrderService.create(formData);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      console.error('Error saving work order', err);
      setError('Error al guardar la orden de trabajo. Revisa los datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={workOrder ? 'Editar Orden de Trabajo' : 'Nueva Orden de Trabajo'}
      description="Registra la orden operativa para el equipo en campo"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Clave / Folio"
            type="number"
            value={formData.clave}
            onChange={(e) => setFormData({ ...formData, clave: Number(e.target.value) })}
            required
          />

          <Select
            label="Proyecto"
            value={formData.idProject || ''}
            onChange={(e) => handleProjectChange(Number(e.target.value))}
            options={projects.map((p) => ({ value: p.id, label: p.projectName }))}
            placeholder="-- Seleccionar Proyecto --"
            required
          />

          <Select
            label="Cliente"
            value={formData.idCustomer || ''}
            onChange={(e) => setFormData({ ...formData, idCustomer: Number(e.target.value) })}
            options={customers.map((c) => ({ value: c.id, label: c.companyName }))}
            placeholder="-- Seleccionar Cliente --"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Trabajador / Responsable"
            value={formData.idAssigned || ''}
            onChange={(e) => setFormData({ ...formData, idAssigned: Number(e.target.value) })}
            options={workers.map((w) => ({ value: w.id, label: w.name }))}
            placeholder="-- Asignar Trabajador --"
            required
          />

          <Select
            label="Proveedor"
            value={formData.idProvider || ''}
            onChange={(e) => setFormData({ ...formData, idProvider: Number(e.target.value) })}
            options={providers.map((p) => ({ value: p.id, label: p.name }))}
            placeholder="-- Seleccionar Proveedor --"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Fecha Inicio"
            type="date"
            value={formData.dateOrder}
            onChange={(e) => setFormData({ ...formData, dateOrder: e.target.value })}
            required
          />

          <Input
            label="Fecha Fin / Entrega"
            type="date"
            value={formData.dateEnd}
            onChange={(e) => setFormData({ ...formData, dateEnd: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Contacto en Sitio"
            value={formData.contact || ''}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            placeholder="Persona encargada o supervisor"
          />

          <Input
            label="Teléfono de Contacto"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(555) 000-0000"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Dirección de la Obra"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Ubicación del trabajo"
          />

          <Input
            label="Ciudad"
            value={formData.city || ''}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Ciudad"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Tipo de Orden"
            value={formData.idType || 1}
            onChange={(e) => setFormData({ ...formData, idType: Number(e.target.value) })}
            options={
              typesWO.length > 0
                ? typesWO.map((t) => ({ value: t.id, label: t.description }))
                : [{ value: 1, label: 'Ordinaria' }]
            }
          />

          <Select
            label="Estado Orden (WO)"
            value={formData.idStatusWO || 1}
            onChange={(e) => setFormData({ ...formData, idStatusWO: Number(e.target.value) })}
            options={
              statusWO.length > 0
                ? statusWO.map((s) => ({ value: s.id, label: s.description }))
                : [{ value: 1, label: 'Pendiente' }]
            }
          />

          <Select
            label="Estado Calendario"
            value={formData.idStatusCalendario || 1}
            onChange={(e) =>
              setFormData({ ...formData, idStatusCalendario: Number(e.target.value) })
            }
            options={
              statusDate.length > 0
                ? statusDate.map((s) => ({ value: s.id, label: s.description }))
                : [{ value: 1, label: 'Programada' }]
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Instrucciones y Observaciones del Servicio
          </label>
          <textarea
            rows={3}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Especificar labores requeridas (ej: limpieza profunda de cristales, desmanchado de pisos, retiro de escombros)..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {workOrder ? 'Guardar Cambios' : 'Crear Orden de Trabajo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
