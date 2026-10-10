import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, Bell, Menu } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          title="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-sky-50 text-sky-700 rounded-md border border-sky-100">
            Control Operativo
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Icon (indicative) */}
        <button
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative"
          title="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-500 rounded-full" />
        </button>

        {/* User profile / session */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm shadow-inner">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-slate-800 capitalize leading-tight">
              {user?.username || 'Usuario'}
            </p>
            <p className="text-xs text-slate-500">Administrador</p>
          </div>

          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
