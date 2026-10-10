import React, { useState, useEffect, useCallback } from 'react';
import type { WorkOrder } from '@/types/workOrder';
import type { Project } from '@/types/project';
import type { Customer } from '@/types/customer';
import type { Worker } from '@/types/catalogs';
import { workOrderService } from '@/services/workOrderService';
import { projectService } from '@/services/projectService';
import { customerService } from '@/services/customerService';
import { catalogService } from '@/services/catalogService';
import { Plus, Search, Eye, Edit2, Trash2, ClipboardList, Calendar, User } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { WorkOrderFormModal } from './WorkOrderFormModal';
import { WorkOrderDetailsModal } from './WorkOrderDetailsModal';

export const WorkOrdersListPage: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Catalogs for lookup
  const [projectsMap, setProjectsMap] = useState<Record<number, string>>({});
  const [customersMap, setCustomersMap] = useState<Record<number, string>>({});
  const [workersMap, setWorkersMap] = useState<Record<number, string>>({});

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedWOForEdit, setSelectedWOForEdit] = useState<WorkOrder | null>(null);
  const [selectedWOForView, setSelectedWOForView] = useState<WorkOrder | null>(null);

  // Delete
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load catalogs once
  useEffect(() => {
    async function loadLookups() {
      try {
        const [pRes, cRes, wRes] = await Promise.allSettled([
          projectService.getProjects({ pageSize: 100 }),
          customerService.getAll({ pageSize: 100 }),
          catalogService.getWorkers({ pageSize: 100 }),
        ]);

        if (pRes.status === 'fulfilled') {
          const pMap: Record<number, string> = {};
          pRes.value.data.forEach((p) => {
            pMap[p.id] = p.projectName;
          });
          setProjectsMap(pMap);
        }

        if (cRes.status === 'fulfilled') {
          const cMap: Record<number, string> = {};
          cRes.value.data.forEach((c) => {
            cMap[c.id] = c.companyName;
          });
          setCustomersMap(cMap);
        }

        if (wRes.status === 'fulfilled') {
          const wMap: Record<number, string> = {};
          wRes.value.data.forEach((w) => {
            wMap[w.id] = w.name;
          });
          setWorkersMap(wMap);
        }
      } catch (err) {
        console.error('Error loading lookups for work orders', err);
      }
    }

    loadLookups();
  }, []);

  const fetchWorkOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await workOrderService.getAll({
        pageNumber: currentPage,
        pageSize,
        orderBy: 'ID',
        desc: true,
      });
      setWorkOrders(res.data);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching work orders', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  const handleOpenCreate = () => {
    setSelectedWOForEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (wo: WorkOrder) => {
    setSelectedWOForEdit(wo);
    setIsFormOpen(true);
  };

  const handleOpenDetails = (wo: WorkOrder) => {
    setSelectedWOForView(wo);
    setIsDetailsOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await workOrderService.delete(deleteId);
      setDeleteId(null);
      fetchWorkOrders();
    } catch (err) {
      console.error('Error deleting work order', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredWorkOrders = workOrders.filter((wo) => {
    const q = searchTerm.toLowerCase();
    const projName = projectsMap[wo.idProject] || '';
    const custName = customersMap[wo.idCustomer] || '';
    const workerName = workersMap[wo.idAssigned] || '';
    return (
      wo.clave?.toString().includes(q) ||
      wo.contact?.toLowerCase().includes(q) ||
      wo.city?.toLowerCase().includes(q) ||
      projName.toLowerCase().includes(q) ||
      custName.toLowerCase().includes(q) ||
      workerName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 text-sky-600" /> Órdenes de Trabajo
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Programación, cuadrillas, seguimiento de ejecuciones y bitácora en sitio
          </p>
        </div>
        <Button onClick={handleOpenCreate} icon={<Plus className="w-4 h-4" />}>
          Nueva Orden de Trabajo
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:max-w-md">
          <Input
            placeholder="Buscar por folio, cliente, proyecto o personal asignado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total registradas: <strong className="text-slate-800">{totalCount}</strong>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <LoadingSpinner message="Cargando órdenes de trabajo..." fullHeight />
        ) : filteredWorkOrders.length === 0 ? (
          <EmptyState
            title="No se encontraron órdenes de trabajo"
            description="No hay registros creados con los parámetros especificados."
            actionText="Crear primera orden"
            onAction={handleOpenCreate}
            icon={<ClipboardList className="w-8 h-8" />}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Folio / Clave</th>
                  <th className="py-3.5 px-6">Proyecto &amp; Cliente</th>
                  <th className="py-3.5 px-6">Responsable Asignado</th>
                  <th className="py-3.5 px-6">Fechas</th>
                  <th className="py-3.5 px-6">Estado</th>
                  <th className="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWorkOrders.map((wo) => {
                  const projName = projectsMap[wo.idProject] || `Proyecto #${wo.idProject}`;
                  const custName = customersMap[wo.idCustomer] || `Cliente #${wo.idCustomer}`;
                  const workerName = workersMap[wo.idAssigned] || `ID: ${wo.idAssigned}`;

                  return (
                    <tr key={wo.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-base">#{wo.clave}</div>
                        <div className="text-[11px] text-slate-400">ID: {wo.id}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900">{projName}</div>
                        <div className="text-xs text-slate-500">{custName}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800 text-xs">
                          <User className="w-3.5 h-3.5 text-sky-600" />
                          <span>{workerName}</span>
                        </div>
                        {wo.contact && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Sitio: {wo.contact}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {wo.dateOrder ? new Date(wo.dateOrder).toLocaleDateString() : 'N/A'} -{' '}
                            {wo.dateEnd ? new Date(wo.dateEnd).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="purple">Orden #{wo.idStatusWO}</Badge>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetails(wo)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                            title="Ver detalles y bitácora"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(wo)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                            title="Editar orden"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(wo.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Eliminar orden"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!isLoading && totalCount > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* Form Modal */}
      <WorkOrderFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={fetchWorkOrders}
        workOrder={selectedWOForEdit}
      />

      {/* Details Modal */}
      <WorkOrderDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        workOrder={selectedWOForView}
        projectName={selectedWOForView ? projectsMap[selectedWOForView.idProject] : undefined}
        customerName={selectedWOForView ? customersMap[selectedWOForView.idCustomer] : undefined}
        workerName={selectedWOForView ? workersMap[selectedWOForView.idAssigned] : undefined}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Orden de Trabajo"
        message="¿Estás seguro de que deseas eliminar esta orden de trabajo? Esta acción no se puede deshacer."
        isConfirming={isDeleting}
      />
    </div>
  );
};
