import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Cargando información...',
  size = 'md',
  fullHeight = false,
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 gap-3 text-slate-500 ${
        fullHeight ? 'min-h-[400px]' : ''
      }`}
    >
      <Loader2 className={`${sizeClasses[size]} animate-spin text-sky-600`} />
      {message && <p className="text-sm font-medium animate-pulse">{message}</p>}
    </div>
  );
};
