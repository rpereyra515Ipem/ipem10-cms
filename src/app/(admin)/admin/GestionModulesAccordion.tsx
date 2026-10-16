'use client';

import { useState } from 'react';

export default function GestionModulesAccordion({
  isMaster,
  children,
}: {
  isMaster: boolean;
  children: React.ReactNode;
}) {
  // Para el Master inicia plegado (false) para limpiar su dashboard; para el resto inicia desplegado (true)
  const [isOpen, setIsOpen] = useState(!isMaster);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-5 shadow-sm transition-all duration-200 flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
            📚
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight group-hover:text-emerald-900 transition-colors">
                Módulos de Gestión y Operaciones Escolares
              </h2>
              {isMaster && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                  Secundario para Master
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isOpen
                ? 'Noticias, secretaría, mesas de examen, programas y circulares institucionales.'
                : 'Sección colapsada. Haga clic aquí para desplegar las operaciones escolares.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 group-hover:text-emerald-800 transition-colors shrink-0">
          <span className="hidden sm:inline">{isOpen ? 'Ocultar' : 'Desplegar'}</span>
          <span className={`text-lg transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
            ▼
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-6 pt-2">
          {children}
        </div>
      )}
    </div>
  );
}
