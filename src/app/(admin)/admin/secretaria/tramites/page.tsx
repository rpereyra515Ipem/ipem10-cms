import { db } from '@/db';
import { tramites } from '@/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import TramitesTableClient from './TramitesTableClient';

export const dynamic = 'force-dynamic';

export default async function BandejaSecretariaPage() {
  const lista = await db.select().from(tramites).orderBy(desc(tramites.createdAt));

  const pendientes = lista.filter((t) => t.status === 'PENDIENTE').length;
  const enCotejo = lista.filter((t) => t.status === 'EN_COTEJO').length;
  const paraFirma = lista.filter((t) => t.status === 'PARA_FIRMA').length;
  const listas = lista.filter((t) => t.status === 'LISTA_PARA_RETIRAR').length;

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 border-2 border-amber-500/40 rounded-2xl p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded font-black uppercase">
              Secretaría Escolar
            </span>
            <span className="text-xs text-emerald-200">Mesa de Entradas Digital</span>
          </div>
          <h1 className="text-2xl font-black text-white">Bandeja de Solicitudes y Constancias</h1>
          <p className="text-xs text-emerald-200 mt-0.5">
            Cotejo con Libro Matriz / SGE y gestión del refrendo de firmas.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/20"
          >
            ← Volver al Panel
          </Link>
        </div>
      </div>

      {/* Contadores Operativos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border-l-4 border-amber-500 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block">1. Nuevas Solicitudes</span>
          <span className="text-2xl font-black text-slate-900">{pendientes}</span>
          <span className="text-[10px] text-amber-700 font-semibold block mt-1">Pendientes de inicio</span>
        </div>

        <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block">2. En Cotejo SGE / Matriz</span>
          <span className="text-2xl font-black text-slate-900">{enCotejo}</span>
          <span className="text-[10px] text-blue-700 font-semibold block mt-1">Verificando escolaridad</span>
        </div>

        <div className="bg-white p-4 rounded-xl border-l-4 border-purple-500 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block">3. Para Firma Conjunta</span>
          <span className="text-2xl font-black text-slate-900">{paraFirma}</span>
          <span className="text-[10px] text-purple-700 font-semibold block mt-1">Director y Secretario</span>
        </div>

        <div className="bg-white p-4 rounded-xl border-l-4 border-emerald-500 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block">4. Listas en Ventanilla</span>
          <span className="text-2xl font-black text-slate-900">{listas}</span>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-1">Para entrega a familias</span>
        </div>
      </div>

      {/* Tabla Interactiva de Trámites */}
      <TramitesTableClient initialData={lista} />
    </div>
  );
}
