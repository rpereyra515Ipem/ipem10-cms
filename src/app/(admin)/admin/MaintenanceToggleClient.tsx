'use client';

import { useState } from 'react';
import { toggleMaintenanceAction } from '@/actions/maintenance';

export default function MaintenanceToggleClient({ initialIsMaintenance }: { initialIsMaintenance: boolean }) {
  const [isMaintenance, setIsMaintenance] = useState(initialIsMaintenance);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleToggle = async () => {
    const confirmText = isMaintenance
      ? '¿Estás seguro de que deseas desactivar el mantenimiento y ABRIR el sitio web y RomaBot a todo el público?'
      : '¿Estás seguro de que deseas ACTIVAR el Modo Mantenimiento? Los visitantes anónimos verán la pantalla de mantenimiento y RomaBot responderá en modo restringido.';
    
    if (!window.confirm(confirmText)) return;

    setLoading(true);
    setMsg('');
    const res = await toggleMaintenanceAction();
    setLoading(false);

    if (res.success && typeof res.isMaintenance === 'boolean') {
      setIsMaintenance(res.isMaintenance);
      setMsg(res.isMaintenance ? '⚠️ Mantenimiento activado en la web y en RomaBot.' : '🚀 Sitio y RomaBot abiertos al público.');
    } else {
      setMsg(`Error: ${res.error}`);
    }
  };

  return (
    <div className="bg-slate-950/80 border border-purple-800/40 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-inner">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-white">Estado del Sitio & RomaBot:</span>
          {isMaintenance ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              MANTENIMIENTO ACTIVO
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              EN LÍNEA (PÚBLICO)
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400">
          {isMaintenance
            ? 'Los visitantes ven el aviso de renovación. Solo Master y Directivos navegan normalmente con sesión.'
            : 'El portal escolar y RomaBot están 100% abiertos a estudiantes, familias y docentes.'}
        </p>
        {msg && <p className="text-xs font-bold text-amber-300 pt-0.5">{msg}</p>}
      </div>

      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className={`px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-md shrink-0 flex items-center gap-1.5 ${
          isMaintenance
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/50'
        } disabled:opacity-50`}
      >
        <span>{isMaintenance ? '🚀' : '⚠️'}</span>
        <span>
          {loading
            ? 'Aplicando cambio...'
            : isMaintenance
            ? 'Abrir Sitio al Público'
            : 'Activar Mantenimiento'}
        </span>
      </button>
    </div>
  );
}
