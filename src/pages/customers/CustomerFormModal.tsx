import React, { useState, useEffect } from 'react';
import type { Customer, CustomerFormData } from '@/types/customer';
import { customerService } from '@/services/customerService';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  customer?: Customer | null;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  customer,
}) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    companyName: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
    email: '',
    status: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setFormData({
        id: customer.id,
        companyName: customer.companyName || '',
        address: customer.address || '',
        city: customer.city || '',
        zip: customer.zip || '',
        phone: customer.phone || '',
        email: customer.email || '',
        status: customer.status ?? true,
      });
    } else {
      setFormData({
        companyName: '',
        address: '',
        city: '',
        zip: '',
        phone: '',
        email: '',
        status: true,
      });
    }
    setError(null);
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (customer && customer.id) {
        await customerService.update(customer.id, {
          ...formData,
          id: customer.id,
        } as Customer);
      } else {
        await customerService.create(formData);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      console.error('Error saving customer', err);
      setError('Error al guardar el cliente. Revisa los datos ingresados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer ? 'Editar Cliente' : 'Nuevo Cliente'}
      description="Completa la información del cliente o empresa"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <Input
          label="Nombre de la Empresa"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          placeholder="Ej: ABC Facility Services"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Teléfono"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Ej: (555) 000-0000"
          />

          <Input
            label="Correo Electrónico"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="contacto@empresa.com"
          />
        </div>

        <Input
          label="Dirección"
          value={formData.address || ''}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Calle, número, oficina"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Ciudad"
            value={formData.city || ''}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Ej: Los Angeles"
          />

          <Input
            label="Código Postal (ZIP)"
            value={formData.zip || ''}
            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            placeholder="Ej: 90001"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="status"
            checked={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
          />
          <label htmlFor="status" className="text-sm font-medium text-slate-700 cursor-pointer">
            Cliente Activo
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {customer ? 'Guardar Cambios' : 'Crear Cliente'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
