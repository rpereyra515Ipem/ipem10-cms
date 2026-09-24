'use client';

import { useState } from 'react';
import { changePasswordAction } from '@/actions/auth';
import SchoolLogo from '@/components/SchoolLogo';

export default function CambiarPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Reglas de validación evaluadas en vivo
  const hasLength = password.length >= 10;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  const blacklist = ['ipem', 'roma', 'alberdi', 'cordoba', 'escuela', 'colegio', '123456', 'admin'];
  const noBlacklist = password.length > 0 && !blacklist.some((term) => password.toLowerCase().includes(term));
  const matches = password.length > 0 && password === confirm;

  const allValid = hasLength && hasUpper && hasLower && hasNumber && hasSymbol && noBlacklist && matches;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!allValid) return;
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await changePasswordAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-3">
          <SchoolLogo size="md" />
        </div>
        <h1 className="text-2xl font-bold text-white">Configura tu Contraseña Personal</h1>
        <p className="mt-1 text-xs text-emerald-300">
          Por seguridad institucional, debes establecer una contraseña segura antes de continuar.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-gray-100 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Nueva Contraseña
              </label>
              <input
                name="newPassword"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu nueva clave..."
                className="w-full px-3.5 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Repetir Nueva Contraseña
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Vuelve a escribir la clave..."
                className="w-full px-3.5 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {/* Checklist interactivo en tiempo real */}
            <div className="bg-slate-50 p-4 rounded-xl border space-y-2 text-xs">
              <p className="font-bold text-gray-800 text-[11px] uppercase tracking-wider mb-2">
                Requisitos de Seguridad Obligatorios:
              </p>
              <div className={`flex items-center gap-2 ${hasLength ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                <span>{hasLength ? '✓' : '○'}</span>
                <span>Al menos 10 caracteres</span>
              </div>
              <div className={`flex items-center gap-2 ${hasUpper && hasLower ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                <span>{hasUpper && hasLower ? '✓' : '○'}</span>
                <span>Combina mayúsculas (A-Z) y minúsculas (a-z)</span>
              </div>
              <div className={`flex items-center gap-2 ${hasNumber ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                <span>{hasNumber ? '✓' : '○'}</span>
                <span>Al menos un número (0-9)</span>
              </div>
              <div className={`flex items-center gap-2 ${hasSymbol ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                <span>{hasSymbol ? '✓' : '○'}</span>
                <span>Al menos un símbolo (!, @, #, $, etc.)</span>
              </div>
              <div className={`flex items-center gap-2 ${noBlacklist ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                <span>{noBlacklist ? '✓' : '○'}</span>
                <span>No contiene nombres de la escuela (ipem, roma, etc.)</span>
              </div>
              <div className={`flex items-center gap-2 ${matches ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                <span>{matches ? '✓' : '○'}</span>
                <span>Las dos contraseñas coinciden</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!allValid || loading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-4 rounded-lg shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar y Activar Cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
