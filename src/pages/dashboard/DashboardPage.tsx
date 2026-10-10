import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  ClipboardList,
  Users,
  HardHat,
  ArrowRight,
  PlusCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { projectService } from '@/services/projectService';
import { workOrderService } from '@/services/workOrderService';
import { customerService } from '@/services/customerService';
import { catalogService } from '@/services/catalogService';
import type { VListProject } from '@/types/project';
import { Badge } from '@/components/common/Badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    projectsCount: 0,
    workOrdersCount: 0,
    customersCount: 0,
    workersCount: 0,
  });
  const [recentProjects, setRecentProjects] = useState<VListProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const [projectsRes, workOrdersRes, customersRes, workersRes] = await Promise.allSettled([
          projectService.getVListProjects({ pageSize: 5 }),
          workOrderService.getAll({ pageSize: 1 }),
          customerService.getAll({ pageSize: 1 }),
          catalogService.getWorkers({ pageSize: 1 }),
        ]);

        const pCount = projectsRes.status === 'fulfilled' ? projectsRes.value.totalCount : 0;
        const woCount = workOrdersRes.status === 'fulfilled' ? workOrdersRes.value.totalCount : 0;
        const cCount = customersRes.status === 'fulfilled' ? customersRes.value.totalCount : 0;
        const wCount = workersRes.status === 'fulfilled' ? workersRes.value.totalCount : 0;

        setStats({
          projectsCount: pCount,
          workOrdersCount: woCount,
          customersCount: cCount,
          workersCount: wCount,
        });

        if (projectsRes.status === 'fulfilled') {
          setRecentProjects(projectsRes.value.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Cargando panel de control..." fullHeight />;
  }

  const statCards = [
    {
      title: 'Proyectos',
      value: stats.projectsCount,
      icon: FolderKanban,
      color: 'bg-sky-500',
      textColor: 'text-sky-600',
      bgColor: 'bg-sky-50',
      link: '/projects',
    },
    {
      title: 'Órdenes de Trabajo',
      value: stats.workOrdersCount,
      icon: ClipboardList,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      link: '/work-orders',
    },
    {
      title: 'Clientes',
      value: stats.customersCount,
      icon: Users,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      link: '/customers',
    },
    {
      title: 'Trabajadores',
      value: stats.workersCount,
      icon: HardHat,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      link: '/workers',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> California Clean
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Panel de Gestión Operativa
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Bienvenido al sistema integral de órdenes de trabajo, seguimiento de proyectos,
            asignaciones y control de clientes de limpieza especializada.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs rounded-xl shadow-lg shadow-sky-500/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Administrar Proyectos
            </Link>
            <Link
              to="/work-orders"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/10 transition-all"
            >
              <ClipboardList className="w-4 h-4" /> Ver Órdenes de Trabajo
            </Link>
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-sky-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.textColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-black text-slate-900">{card.value}</span>
                <span className="text-xs font-semibold text-sky-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explorar <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Projects Table Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Proyectos Recientes</h2>
            <p className="text-xs text-slate-500 mt-0.5">Últimos proyectos registrados en la plataforma</p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1.5"
          >
            Ver todos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No se han registrado proyectos recientemente.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Proyecto</th>
                  <th className="py-3 px-6">Cliente</th>
                  <th className="py-3 px-6">Ubicación</th>
                  <th className="py-3 px-6">Tipo</th>
                  <th className="py-3 px-6">Estado</th>
                  <th className="py-3 px-6 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {proj.projectName}
                    </td>
                    <td className="py-4 px-6 text-slate-700">{proj.companyName || '—'}</td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {proj.address} {proj.city ? `(${proj.city})` : ''}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600">
                      {proj.typeProjectDescription || 'General'}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="info">{proj.status || 'Activo'}</Badge>
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-slate-900">
                      {proj.amount ? `$${Number(proj.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick operational cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2 text-sky-800 font-bold text-sm">
            <Clock className="w-4 h-4 text-sky-600" />
            Flujo de Órdenes de Trabajo
          </div>
          <p className="text-xs text-sky-900/80 leading-relaxed">
            Asigna personal a cada orden, programa fechas límites, documenta notas y genera
            impresiones de órdenes de servicio en PDF/físico.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2 text-emerald-800 font-bold text-sm">
            <Users className="w-4 h-4 text-emerald-600" />
            Control de Clientes
          </div>
          <p className="text-xs text-emerald-900/80 leading-relaxed">
            Administra compañías clientes, teléfonos de contacto, direcciones y el historial de
            sus proyectos y órdenes asociadas.
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2 text-purple-800 font-bold text-sm">
            <HardHat className="w-4 h-4 text-purple-600" />
            Cuadrillas y Personal
          </div>
          <p className="text-xs text-purple-900/80 leading-relaxed">
            Registra trabajadores y supervisores disponibles para coordinar el trabajo en campo
            y llevar control de horas y sobretiempos.
          </p>
        </div>
      </div>
    </div>
  );
};
