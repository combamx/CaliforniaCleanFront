import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-slate-200 text-sm text-slate-600">
      <div className="flex items-center gap-3">
        <span>
          Mostrando <strong className="text-slate-800">{startItem}</strong> a{' '}
          <strong className="text-slate-800">{endItem}</strong> de{' '}
          <strong className="text-slate-800">{totalCount}</strong> resultados
        </span>
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-xs text-slate-500">Por pág:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Primera página"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 font-medium text-slate-700 text-xs">
          Pág {currentPage} de {totalPages || 1}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Última página"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
