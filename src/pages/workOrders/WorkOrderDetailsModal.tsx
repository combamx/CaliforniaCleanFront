import React, { useState, useEffect } from 'react';
import type { WorkOrder, CommentsWO } from '@/types/workOrder';
import { workOrderService } from '@/services/workOrderService';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  Calendar,
  MapPin,
  Phone,
  User,
  MessageSquare,
  Send,
  Printer,
  FileText,
} from 'lucide-react';
import { decodeHtml } from '@/utils/htmlHelper';

interface WorkOrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrder | null;
  projectName?: string;
  customerName?: string;
  workerName?: string;
}

export const WorkOrderDetailsModal: React.FC<WorkOrderDetailsModalProps> = ({
  isOpen,
  onClose,
  workOrder,
  projectName,
  customerName,
  workerName,
}) => {
  const [comments, setComments] = useState<CommentsWO[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    async function loadComments() {
      if (!workOrder) return;
      setIsLoadingComments(true);
      try {
        const res = await workOrderService.getComments({ pageSize: 50 });
        // Filter comments for this work order
        const related = res.data.filter((c) => c.idWorkOrder === workOrder.id);
        setComments(related);
      } catch (e) {
        console.error('Error loading comments', e);
      } finally {
        setIsLoadingComments(false);
      }
    }

    if (isOpen && workOrder) {
      loadComments();
    }
  }, [isOpen, workOrder]);

  if (!workOrder) return null;

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsAddingComment(true);

    try {
      const added = await workOrderService.addComment({
        idWorkOrder: workOrder.id,
        description: newComment.trim(),
      });
      setComments((prev) => [...prev, added]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment', err);
    } finally {
      setIsAddingComment(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Orden de Trabajo #${workOrder.clave}`}
      description={`ID Sistema: ${workOrder.id} • ${projectName || `Proyecto #${workOrder.idProject}`}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Top Status & Summary */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Cliente:
            </span>
            <span className="text-base font-bold text-slate-900">
              {customerName || `Cliente #${workOrder.idCustomer}`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="info">Estado WO: #{workOrder.idStatusWO}</Badge>
            <Button
              variant="outline"
              size="sm"
              icon={<Printer className="w-3.5 h-3.5" />}
              onClick={handlePrint}
            >
              Imprimir
            </Button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5 text-sky-600" /> Período de Ejecución
            </div>
            <p className="font-semibold text-slate-800">
              {workOrder.dateOrder ? new Date(workOrder.dateOrder).toLocaleDateString() : 'N/A'} al{' '}
              {workOrder.dateEnd ? new Date(workOrder.dateEnd).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <User className="w-3.5 h-3.5 text-sky-600" /> Responsable Asignado
            </div>
            <p className="font-semibold text-slate-800">
              {workerName || `Trabajador ID: ${workOrder.idAssigned}`}
            </p>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5 text-sky-600" /> Dirección de Trabajo
            </div>
            <p className="font-semibold text-slate-800">{workOrder.address || 'No especificada'}</p>
            {workOrder.city && <p className="text-xs text-slate-500 mt-0.5">{workOrder.city}</p>}
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <Phone className="w-3.5 h-3.5 text-sky-600" /> Contacto en Obra
            </div>
            <p className="font-semibold text-slate-800">{workOrder.contact || 'Sin contacto'}</p>
            {workOrder.phone && <p className="text-xs text-slate-500 mt-0.5">{workOrder.phone}</p>}
          </div>
        </div>

        {/* Description / Instructions */}
        {workOrder.description && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5 text-sky-600" /> Indicaciones Operativas
            </div>
            <div
              className="text-sm text-slate-700 leading-relaxed [&_p]:mb-2 [&_strong]:font-bold [&_em]:italic [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol]:space-y-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:space-y-1 [&_li]:leading-normal"
              dangerouslySetInnerHTML={{ __html: decodeHtml(workOrder.description) }}
            />
          </div>
        )}

        {/* Comments Section */}
        <div className="border-t border-slate-200 pt-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-sky-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Comentarios y Bitácora ({comments.length})
            </h4>
          </div>

          {isLoadingComments ? (
            <p className="text-xs text-slate-400">Cargando comentarios...</p>
          ) : comments.length === 0 ? (
            <p className="text-xs text-slate-400 italic mb-4">
              Aún no hay notas o comentarios registrados para esta orden.
            </p>
          ) : (
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-1">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-lg bg-slate-100/80 text-xs text-slate-800 border border-slate-200/50"
                >
                  <p>{c.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add comment input */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe una actualización o nota de supervisión..."
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500"
            />
            <Button
              type="submit"
              size="sm"
              variant="primary"
              isLoading={isAddingComment}
              icon={<Send className="w-3.5 h-3.5" />}
            >
              Enviar
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
