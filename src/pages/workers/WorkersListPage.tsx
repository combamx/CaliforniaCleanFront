import React, { useState, useEffect, useCallback } from 'react';
import type { Worker } from '@/types/catalogs';
import { catalogService } from '@/services/catalogService';
import { HardHat, Search, Plus, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export const WorkersListPage: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // New worker modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorker, setNewWorker] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    status: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await catalogService.getWorkers({
        pageNumber: currentPage,
        pageSize,
        orderBy: 'Name',
      });
      setWorkers(res.data);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching workers', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const handleCreateWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorker.name) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await catalogService.createWorker(newWorker);
      setIsModalOpen(false);
      setNewWorker({ name: '', address: '', phone: '', email: '', status: 1 });
      fetchWorkers();
    } catch (err) {
      console.error('Error creating worker', err);
      setError('Error al registrar el trabajador.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredWorkers = workers.filter((w) => {
    const q = searchTerm.toLowerCase();
    return (
      w.name?.toLowerCase().includes(q) ||
      w.phone?.toLowerCase().includes(q) ||
      w.email?.toLowerCase().includes(q) ||
      w.address?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <HardHat className="w-6 h-6 text-sky-600" /> Trabajadores y Personal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Plantilla operativa y personal asignado para servicios y cuadrillas de limpieza
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
          Nuevo Trabajador
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:max-w-md">
          <Input
            placeholder="Buscar por nombre, teléfono o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total personal: <strong className="text-slate-800">{totalCount}</strong>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <LoadingSpinner message="Cargando personal..." fullHeight />
        ) : filteredWorkers.length === 0 ? (
          <EmptyState
            title="No se encontraron trabajadores"
            description="No hay registros de trabajadores activos o la búsqueda no arrojó resultados."
            actionText="Registrar primer trabajador"
            onAction={() => setIsModalOpen(true)}
            icon={<HardHat className="w-8 h-8" />}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Nombre del Trabajador</th>
                  <th className="py-3.5 px-6">Contacto</th>
                  <th className="py-3.5 px-6">Dirección</th>
                  <th className="py-3.5 px-6">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      <div>{w.name}</div>
                      <div className="text-[11px] text-slate-400">ID #{w.id}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1 text-xs">
                        {w.phone && (
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{w.phone}</span>
                          </div>
                        )}
                        {w.email && (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{w.email}</span>
                          </div>
                        )}
                        {!w.phone && !w.email && <span className="text-slate-400">—</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{w.address || 'No registrada'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="success">Disponible</Badge>
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

      {/* New Worker Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Nuevo Trabajador"
        description="Agrega un miembro al equipo de trabajo"
        maxWidth="md"
      >
        <form onSubmit={handleCreateWorker} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          <Input
            label="Nombre Completo"
            value={newWorker.name}
            onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
            placeholder="Ej: Carlos Mendoza"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Teléfono"
              value={newWorker.phone}
              onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
              placeholder="(555) 000-0000"
            />

            <Input
              label="Correo"
              type="email"
              value={newWorker.email}
              onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <Input
            label="Dirección"
            value={newWorker.address}
            onChange={(e) => setNewWorker({ ...newWorker, address: e.target.value })}
            placeholder="Dirección particular"
          />

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Guardar Trabajador
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
