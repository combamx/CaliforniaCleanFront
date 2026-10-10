import React from 'react';
import type { VListProject } from '@/types/project';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  UserCheck,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { decodeHtml } from '@/utils/htmlHelper';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: VListProject | null;
  onEdit?: (project: VListProject) => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  isOpen,
  onClose,
  project,
  onEdit,
}) => {
  if (!project) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project.projectName}
      description={`ID #${project.id} • ${project.companyName || 'Sin Cliente'}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Status & Highlights */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Estado:
            </span>
            <Badge variant="info">{project.status || 'Activo'}</Badge>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Monto Contratado</span>
            <span className="text-xl font-bold text-slate-900">
              {project.amount ? `$${Number(project.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'}
            </span>
          </div>
        </div>

        {/* General Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5 text-sky-600" /> Ubicación
            </div>
            <p className="font-semibold text-slate-800">{project.address}</p>
            {project.city && <p className="text-slate-500 text-xs mt-0.5">{project.city}</p>}
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <Building2 className="w-3.5 h-3.5 text-sky-600" /> Clasificación
            </div>
            <p className="font-semibold text-slate-800">
              {project.typeProjectDescription || 'Proyecto General'}
            </p>
            <p className="text-slate-500 text-xs mt-0.5">
              Edificio: {project.typeBuildingDescription || 'No especificado'}
            </p>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5 text-sky-600" /> Fecha del Proyecto
            </div>
            <p className="font-semibold text-slate-800">
              {project.dateProject ? new Date(project.dateProject).toLocaleDateString() : 'No asignada'}
            </p>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> Póliza / OCIP
            </div>
            <p className="font-semibold text-slate-800">{project.ocip || 'N/A'}</p>
          </div>
        </div>

        {/* Commercial & Representative */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <UserCheck className="w-3.5 h-3.5 text-sky-600" /> Vendedor
            </div>
            <p className="font-semibold text-slate-800">{project.nameSelle || 'No asignado'}</p>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <DollarSign className="w-3.5 h-3.5 text-sky-600" /> Retenciones
            </div>
            <p className="font-semibold text-slate-800">
              {project.retentions ? `$${project.retentions}` : '$0.00'}
            </p>
          </div>
        </div>

        {/* Scope / Description */}
        {project.description && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5 text-sky-600" /> Descripción y Alcance
            </div>
            <div
              className="text-sm text-slate-700 leading-relaxed [&_p]:mb-2 [&_strong]:font-bold [&_em]:italic [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol]:space-y-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:space-y-1 [&_li]:leading-normal"
              dangerouslySetInnerHTML={{ __html: decodeHtml(project.description) }}
            />
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          {onEdit && (
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onEdit(project);
              }}
            >
              Editar Proyecto
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
