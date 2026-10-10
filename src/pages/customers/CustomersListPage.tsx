import React, { useState, useEffect, useCallback } from 'react';
import type { Customer } from '@/types/customer';
import { customerService } from '@/services/customerService';
import { Plus, Search, Edit2, Trash2, Users, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Pagination } from '@/components/common/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { CustomerFormModal } from './CustomerFormModal';

export const CustomersListPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Delete dialog states
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await customerService.getAll({
        pageNumber: currentPage,
        pageSize,
        orderBy: 'CompanyName',
        desc: false,
      });
      setCustomers(res.data);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Error fetching customers', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleOpenCreate = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await customerService.delete(deleteId);
      setDeleteId(null);
      fetchCustomers();
    } catch (err) {
      console.error('Error deleting customer', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter client-side when user types in search input
  const filteredCustomers = customers.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.companyName?.toLowerCase().includes(q) ||
      c.city?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-sky-600" /> Clientes
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Administración del padrón de empresas y clientes comerciales
          </p>
        </div>
        <Button onClick={handleOpenCreate} icon={<Plus className="w-4 h-4" />}>
          Nuevo Cliente
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:max-w-md">
          <Input
            placeholder="Buscar por empresa, ciudad, teléfono o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total registrados: <strong className="text-slate-800">{totalCount}</strong>
        </div>
      </div>

      {/* Main Table / View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <LoadingSpinner message="Cargando lista de clientes..." fullHeight />
        ) : filteredCustomers.length === 0 ? (
          <EmptyState
            title="No se encontraron clientes"
            description="No hay registros que coincidan con la búsqueda o aún no has creado clientes."
            actionText="Crear primer cliente"
            onAction={handleOpenCreate}
            icon={<Users className="w-8 h-8" />}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Empresa</th>
                  <th className="py-3.5 px-6">Contacto</th>
                  <th className="py-3.5 px-6">Ubicación</th>
                  <th className="py-3.5 px-6">Estado</th>
                  <th className="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {cust.companyName}
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1 text-xs">
                        {cust.phone && (
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{cust.phone}</span>
                          </div>
                        )}
                        {cust.email && (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{cust.email}</span>
                          </div>
                        )}
                        {!cust.phone && !cust.email && <span className="text-slate-400">—</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <p>{cust.address || 'Sin dirección'}</p>
                          {cust.city && (
                            <p className="text-slate-500 font-medium">
                              {cust.city} {cust.zip ? `, ${cust.zip}` : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={cust.status ? 'success' : 'neutral'}>
                        {cust.status ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(cust)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          title="Editar cliente"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(cust.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar cliente"
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

      {/* Customer Form Modal */}
      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchCustomers}
        customer={selectedCustomer}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Cliente"
        message="¿Estás seguro de que deseas eliminar este cliente? Se eliminarán los registros relacionados si no existen restricciones."
        isConfirming={isDeleting}
      />
    </div>
  );
};
