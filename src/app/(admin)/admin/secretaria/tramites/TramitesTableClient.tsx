'use client';

import { useState } from 'react';
import { actualizarEstadoTramiteAction } from '@/actions/tramites';

export default function TramitesTableClient({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [filter, setFilter] = useState('TODOS');

  const handleCambiarEstado = async (id: number, nuevoEstado: string) => {
    setLoadingId(id);
    const res = await actualizarEstadoTramiteAction(id, nuevoEstado);
    setLoadingId(null);

    if (res.success) {
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: nuevoEstado } : item))
      );
    }
  };

  const filteredData = filter === 'TODOS' ? data : data.filter((t) => t.status === filter);

  const getBadge = (status: string) => {
    switch (status) {
      case 'PENDIENTE':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">🟡 Pendiente</span>;
      case 'EN_COTEJO':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">🔍 En Cotejo</span>;
      case 'PARA_FIRMA':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">✍️ Para Firma</span>;
      case 'LISTA_PARA_RETIRAR':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">🟢 Lista Ventanilla</span>;
      case 'ENTREGADA':
        return <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">📦 Entregada</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
      {/* Filtros rápidos */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex flex-wrap gap-1.5">
          {['TODOS', 'PENDIENTE', 'EN_COTEJO', 'PARA_FIRMA', 'LISTA_PARA_RETIRAR', 'ENTREGADA'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition ${
                filter === f
                  ? 'bg-emerald-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Total: <strong>{filteredData.length}</strong> solicitudes
        </span>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
            <tr>
              <th className="p-3">Código</th>
              <th className="p-3">Alumno / DNI</th>
              <th className="p-3">Curso</th>
              <th className="p-3">Trámite / Motivo</th>
              <th className="p-3">Contacto</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-right">Acción Rápida</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  No hay solicitudes en esta sección.
                </td>
              </tr>
            ) : (
              filteredData.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-mono font-bold text-emerald-900">{t.trackingCode}</td>
                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{t.studentName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">DNI: {t.studentDni}</span>
                  </td>
                  <td className="p-3 font-medium text-slate-800">{t.course}</td>
                  <td className="p-3">
                    <span className="font-semibold text-slate-900 block">{t.requestType}</span>
                    <span className="text-[10px] text-slate-500">{t.purpose}</span>
                  </td>
                  <td className="p-3 text-slate-600 text-[11px]">
                    {t.contactPhone || t.contactEmail ? (
                      <>
                        {t.contactPhone && <div>📞 {t.contactPhone}</div>}
                        {t.contactEmail && <div className="truncate max-w-[140px]">✉️ {t.contactEmail}</div>}
                      </>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="p-3">{getBadge(t.status)}</td>
                  <td className="p-3 text-right">
                    <div className="inline-flex gap-1">
                      {t.status === 'PENDIENTE' && (
                        <button
                          disabled={loadingId === t.id}
                          onClick={() => handleCambiarEstado(t.id, 'EN_COTEJO')}
                          className="px-2.5 py-1 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded text-[11px] font-bold border border-blue-200"
                        >
                          Cotejar →
                        </button>
                      )}
                      {t.status === 'EN_COTEJO' && (
                        <button
                          disabled={loadingId === t.id}
                          onClick={() => handleCambiarEstado(t.id, 'PARA_FIRMA')}
                          className="px-2.5 py-1 bg-purple-50 text-purple-800 hover:bg-purple-100 rounded text-[11px] font-bold border border-purple-200"
                        >
                          A Firma →
                        </button>
                      )}
                      {t.status === 'PARA_FIRMA' && (
                        <button
                          disabled={loadingId === t.id}
                          onClick={() => handleCambiarEstado(t.id, 'LISTA_PARA_RETIRAR')}
                          className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded text-[11px] font-bold shadow-sm"
                        >
                          Lista en Ventanilla ✓
                        </button>
                      )}
                      {t.status === 'LISTA_PARA_RETIRAR' && (
                        <button
                          disabled={loadingId === t.id}
                          onClick={() => handleCambiarEstado(t.id, 'ENTREGADA')}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-[11px] font-semibold border border-slate-300"
                        >
                          Entregar 📦
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
