'use client';

import { useState, useEffect } from 'react';

export default function AuditLogsTableClient({ initialLogs }: { initialLogs: any[] }) {
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedLog(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'HIGH':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'MEDIUM':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
    }
  };

  const formatDetails = (details: any) => {
    if (!details) return 'Sin datos adicionales registrados.';
    try {
      if (typeof details === 'string' && (details.startsWith('{') || details.startsWith('['))) {
        return JSON.stringify(JSON.parse(details), null, 2);
      }
      return typeof details === 'object' ? JSON.stringify(details, null, 2) : String(details);
    } catch {
      return String(details);
    }
  };

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Fecha</th>
              <th className="p-3">Severidad</th>
              <th className="p-3">Acción</th>
              <th className="p-3">Actor</th>
              <th className="p-3">IP</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {initialLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500 font-sans">
                  No hay eventos de seguridad registrados recientemente.
                </td>
              </tr>
            ) : (
              initialLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-purple-950/30 cursor-pointer transition group"
                  title="Haz clic para inspeccionar el evento completo"
                >
                  <td className="p-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-white whitespace-nowrap group-hover:text-amber-300 transition-colors">
                    {log.action}
                  </td>
                  <td className="p-3 text-slate-300 whitespace-nowrap">{log.actorId || 'Anónimo'}</td>
                  <td className="p-3 text-slate-400 whitespace-nowrap">{log.ipAddress}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={log.status === 'SUCCESS' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap font-sans">
                    <span className="text-[10px] text-purple-400 group-hover:text-purple-200 font-bold bg-purple-950/60 px-2 py-1 rounded border border-purple-800/60">
                      👁️ Ver más
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORENSE DE INSPECCIÓN PROFUNDA */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-slate-900 border-2 border-purple-500/60 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl relative overflow-hidden space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del Modal */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-black border ${getSeverityBadge(selectedLog.severity)}`}>
                    {selectedLog.severity}
                  </span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded ${selectedLog.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                    {selectedLog.status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID #{selectedLog.id}</span>
                </div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>🛡️</span>
                  <span>{selectedLog.action}</span>
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition text-lg"
              >
                ✕
              </button>
            </div>

            {/* Grilla de Metadatos Forenses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Fecha y Hora Exacta:</span>
                <span className="text-slate-200">{selectedLog.timestamp}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Dirección IP de Origen:</span>
                <span className="text-amber-300 font-bold">{selectedLog.ipAddress || '127.0.0.1'}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Actor / Usuario Identificado:</span>
                <span className="text-emerald-300 font-bold">{selectedLog.actorId || 'Visitante Anónimo / No autenticado'}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Navegador y Sistema (User-Agent):</span>
                <span className="text-slate-300 text-[11px] break-all block mt-0.5">
                  {selectedLog.userAgent || 'Encabezado no provisto'}
                </span>
              </div>
            </div>

            {/* Payload Técnico / Detalles */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Detalles Técnicos y Diagnóstico (Sanitizado):
              </span>
              <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[11px] font-mono text-purple-300 overflow-x-auto max-h-48 whitespace-pre-wrap leading-relaxed">
                {formatDetails(selectedLog.details)}
              </pre>
            </div>

            {/* Botón de Cierre */}
            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
