import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-xl border border-dashed border-slate-300 my-4">
      <div className="p-4 bg-slate-100 rounded-full text-slate-500 mb-4">
        {icon || <FolderOpen className="w-8 h-8" />}
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
      {actionText && onAction && (
        <div className="mt-5">
          <Button onClick={onAction}>{actionText}</Button>
        </div>
      )}
    </div>
  );
};
