'use client';

import { useState } from 'react';
import { loginAction } from '@/actions/auth';
import SchoolLogo from '@/components/SchoolLogo';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <SchoolLogo size="lg" className="drop-shadow-xl" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">IPEM N° 10 Roma</h1>
        <p className="mt-1 text-sm text-emerald-300">Sistema de Gestión Escolar y Administración</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Iniciar Sesión</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Correo Electrónico Oficial
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="ejemplo@ipem10.edu.ar"
                className="w-full px-3.5 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-4 rounded-lg shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Ingresar al Sistema'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t text-center">
            <Link href="/" className="text-xs text-gray-500 hover:text-emerald-700 font-semibold">
              ← Volver al sitio público de la escuela
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
