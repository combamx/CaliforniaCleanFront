import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ username, password });
      navigate('/');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: string | { message?: string } } };
        const data = axiosErr.response?.data;
        if (typeof data === 'string') {
          setError(data);
        } else if (data?.message) {
          setError(data.message);
        } else {
          setError('Error al iniciar sesión. Verifica tus credenciales o el backend.');
        }
      } else {
        setError('No se pudo conectar con el servidor de la API.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setUsername('admin');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10">
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3.5 bg-sky-500 text-white rounded-2xl shadow-lg shadow-sky-500/30 mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              California<span className="text-sky-600">Clean</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Sistema de Gestión y Control Operativo
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                label="Usuario"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                icon={<User className="w-4 h-4" />}
                required
              />
            </div>

            <div>
              <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-sky-500/25 mt-2"
              isLoading={isLoading}
            >
              Iniciar Sesión
            </Button>
          </form>

          {/* Demo Credentials Helper */}
          <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50/80 -mx-8 -mb-8 p-6 rounded-b-3xl">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Credenciales Demo API:
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-sky-600 hover:text-sky-800 font-semibold underline"
              >
                Autocompletar
              </button>
            </div>
            <div className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono text-slate-700">
              <span>admin</span>
              <span className="text-slate-300">|</span>
              <span>admin123</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 font-medium">
          CaliforniaClean API • ASP.NET Core &amp; React
        </p>
      </div>
    </div>
  );
};
