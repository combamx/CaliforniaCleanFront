import React, { useState, useEffect } from 'react';
import type { Project, ProjectFormData } from '@/types/project';
import type { Customer } from '@/types/customer';
import type { Seller, Provider, TypesProject, Building, StatusProject } from '@/types/catalogs';
import { projectService } from '@/services/projectService';
import { customerService } from '@/services/customerService';
import { catalogService } from '@/services/catalogService';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  project?: Project | null;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  project,
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: '',
    address: '',
    city: '',
    description: '',
    dateProject: new Date().toISOString().split('T')[0],
    amount: 0,
    retentionsProject: 0,
    retentions: 0,
    sellerProject: 0,
    selle: 0,
    idCustomer: 0,
    idSeller: undefined,
    idProvide: undefined,
    idTypeProject: undefined,
    idTypeBuilding: undefined,
    amountProvide: 0,
    inclusion: '',
    ocip: 'N/A',
    status: 1,
  });

  // Catalogs
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [typesProject, setTypesProject] = useState<TypesProject[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [statusList, setStatusList] = useState<StatusProject[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalogs() {
      try {
        const [cRes, sRes, pRes, tRes, bRes, stRes] = await Promise.allSettled([
          customerService.getAll({ pageSize: 100 }),
          catalogService.getSellers(),
          catalogService.getProviders(),
          catalogService.getTypesProjects(),
          catalogService.getBuildings(),
          catalogService.getStatusProjects(),
        ]);

        if (cRes.status === 'fulfilled') setCustomers(cRes.value.data);
        if (sRes.status === 'fulfilled') setSellers(sRes.value.data);
        if (pRes.status === 'fulfilled') setProviders(pRes.value.data);
        if (tRes.status === 'fulfilled') setTypesProject(tRes.value);
        if (bRes.status === 'fulfilled') setBuildings(bRes.value.data);
        if (stRes.status === 'fulfilled') setStatusList(stRes.value);
      } catch (e) {
        console.error('Error loading project catalogs', e);
      }
    }

    if (isOpen) {
      loadCatalogs();
    }
  }, [isOpen]);

  useEffect(() => {
    if (project) {
      setFormData({
        id: project.id,
        projectName: project.projectName || '',
        address: project.address || '',
        city: project.city || '',
        description: project.description || '',
        dateProject: project.dateProject ? project.dateProject.split('T')[0] : '',
        amount: project.amount ?? 0,
        retentionsProject: project.retentionsProject ?? 0,
        retentions: project.retentions ?? 0,
        sellerProject: project.sellerProject ?? 0,
        selle: project.selle ?? 0,
        idCustomer: project.idCustomer || 0,
        idSeller: project.idSeller ?? undefined,
        idProvide: project.idProvide ?? undefined,
        idTypeProject: project.idTypeProject ?? undefined,
        idTypeBuilding: project.idTypeBuilding ?? undefined,
        amountProvide: project.amountProvide ?? 0,
        inclusion: project.inclusion || '',
        ocip: project.ocip || 'N/A',
        status: project.status || 1,
      });
    } else {
      setFormData({
        projectName: '',
        address: '',
        city: '',
        description: '',
        dateProject: new Date().toISOString().split('T')[0],
        amount: 0,
        retentionsProject: 0,
        retentions: 0,
        sellerProject: 0,
        selle: 0,
        idCustomer: customers[0]?.id || 0,
        idSeller: undefined,
        idProvide: undefined,
        idTypeProject: undefined,
        idTypeBuilding: undefined,
        amountProvide: 0,
        inclusion: '',
        ocip: 'N/A',
        status: 1,
      });
    }
    setError(null);
  }, [project, isOpen, customers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.idCustomer) {
      setError('Debes seleccionar un cliente.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      if (project && project.id) {
        await projectService.update(project.id, {
          ...formData,
          id: project.id,
        } as Project);
      } else {
        await projectService.create(formData);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      console.error('Error saving project', err);
      setError('Error al registrar el proyecto. Verifica los campos requeridos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      description="Ingresa los detalles del proyecto de limpieza"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre del Proyecto"
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            placeholder="Ej: Limpieza Torre Reforma"
            required
          />

          <Select
            label="Cliente"
            value={formData.idCustomer || ''}
            onChange={(e) => setFormData({ ...formData, idCustomer: Number(e.target.value) })}
            options={customers.map((c) => ({ value: c.id, label: c.companyName }))}
            placeholder="-- Selecciona Cliente --"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Dirección"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Calle y número"
            required
          />

          <Input
            label="Ciudad"
            value={formData.city || ''}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Ciudad / Estado"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Fecha del Proyecto"
            type="date"
            value={formData.dateProject || ''}
            onChange={(e) => setFormData({ ...formData, dateProject: e.target.value })}
          />

          <Input
            label="Monto Estimado ($)"
            type="number"
            step="0.01"
            value={formData.amount || 0}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
          />

          <Input
            label="OCIP"
            value={formData.ocip}
            onChange={(e) => setFormData({ ...formData, ocip: e.target.value })}
            placeholder="Póliza / N/A"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Tipo de Proyecto"
            value={formData.idTypeProject || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                idTypeProject: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            options={typesProject.map((t) => ({ value: t.id, label: t.description }))}
            placeholder="-- Selecciona Tipo --"
          />

          <Select
            label="Tipo de Edificio"
            value={formData.idTypeBuilding || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                idTypeBuilding: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            options={buildings.map((b) => ({ value: b.id, label: b.description }))}
            placeholder="-- Selecciona Edificio --"
          />

          <Select
            label="Estado"
            value={formData.status || 1}
            onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
            options={
              statusList.length > 0
                ? statusList.map((s) => ({ value: s.id, label: s.description }))
                : [
                    { value: 1, label: 'Activo' },
                    { value: 2, label: 'En Proceso' },
                    { value: 3, label: 'Finalizado' },
                  ]
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Vendedor / Representante"
            value={formData.idSeller || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                idSeller: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            options={sellers.map((s) => ({ value: s.id, label: s.name }))}
            placeholder="-- Selecciona Vendedor --"
          />

          <Select
            label="Proveedor Asignado"
            value={formData.idProvide || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                idProvide: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            options={providers.map((p) => ({ value: p.id, label: p.name }))}
            placeholder="-- Selecciona Proveedor --"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Descripción / Alcance del Servicio
          </label>
          <textarea
            rows={3}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detalles sobre las áreas a limpiar, requerimientos especiales, horarios..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {project ? 'Guardar Cambios' : 'Crear Proyecto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
