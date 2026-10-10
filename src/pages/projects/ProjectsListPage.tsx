import React, { useState, useEffect, useCallback } from 'react';
import type { VListProject, Project } from '@/types/project';
import { projectService } from '@/services/projectService';
import { Plus, Search, Eye, Edit2, Trash2, FolderKanban, MapPin, Building2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ProjectFormModal } from './ProjectFormModal';
import { ProjectDetailsModal } from './ProjectDetailsModal';

export const ProjectsListPage: React.FC = () => {
  const [projects, setProjects] = useState<VListProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<Project | null>(null);
  const [selectedProjectForView, setSelectedProjectForView] = useState<VListProject | null>(null);

  // Delete dialog states
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await projectService.getVListProjects({
        pageNumber: currentPage,
        pageSize,
        orderBy: 'ID',
        desc: true,
      });
      setProjects(res.data);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching projects', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenCreate = () => {
    setSelectedProjectForEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = async (vProject: VListProject) => {
    try {
      // Fetch full raw project model for accurate IDs in select dropdowns
      const raw = await projectService.getById(vProject.id);
      setSelectedProjectForEdit(raw);
      setIsFormOpen(true);
    } catch (err) {
      console.error('Error fetching project by id', err);
    }
  };

  const handleOpenDetails = (vProject: VListProject) => {
    setSelectedProjectForView(vProject);
    setIsDetailsOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await projectService.delete(deleteId);
      setDeleteId(null);
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.projectName?.toLowerCase().includes(q) ||
      p.companyName?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      p.typeProjectDescription?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-sky-600" /> Proyectos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestión y seguimiento integral de contratos y proyectos de limpieza
          </p>
        </div>
        <Button onClick={handleOpenCreate} icon={<Plus className="w-4 h-4" />}>
          Nuevo Proyecto
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:max-w-md">
          <Input
            placeholder="Buscar por proyecto, cliente, ciudad o tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total de proyectos: <strong className="text-slate-800">{totalCount}</strong>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <LoadingSpinner message="Cargando proyectos..." fullHeight />
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            title="No se encontraron proyectos"
            description="No hay proyectos registrados con los filtros seleccionados."
            actionText="Crear primer proyecto"
            onAction={handleOpenCreate}
            icon={<FolderKanban className="w-8 h-8" />}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Proyecto</th>
                  <th className="py-3.5 px-6">Cliente</th>
                  <th className="py-3.5 px-6">Ubicación</th>
                  <th className="py-3.5 px-6">Tipo / Edificio</th>
                  <th className="py-3.5 px-6">Estado</th>
                  <th className="py-3.5 px-6 text-right">Monto</th>
                  <th className="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900">{p.projectName}</div>
                      <div className="text-[11px] text-slate-400">ID #{p.id}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800">{p.companyName || '—'}</div>
                      {p.nameSelle && (
                        <div className="text-xs text-slate-400">Vend: {p.nameSelle}</div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600">
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <span>{p.address}</span>
                          {p.city && <span className="text-slate-400 block">{p.city}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {p.typeProjectDescription || 'General'}
                      </div>
                      {p.typeBuildingDescription && (
                        <div className="text-[11px] text-slate-400">
                          {p.typeBuildingDescription}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="info">{p.status || 'Activo'}</Badge>
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-slate-900">
                      {p.amount ? `$${Number(p.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetails(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          title="Editar proyecto"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar proyecto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={fetchProjects}
        project={selectedProjectForEdit}
      />

      {/* Project Details Modal */}
      <ProjectDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        project={selectedProjectForView}
        onEdit={(p) => handleOpenEdit(p)}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Proyecto"
        message="¿Estás seguro de que deseas eliminar este proyecto? Verifica que no tenga órdenes de trabajo activas asociadas."
        isConfirming={isDeleting}
      />
    </div>
  );
};
