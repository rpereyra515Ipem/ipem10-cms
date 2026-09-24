import { db } from '@/db';
import { memos } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { logoutAction } from '@/actions/auth';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DocentesPage() {
  const session = await getSession();
  const activeMemos = await db.select().from(memos).orderBy(desc(memos.createdAt));

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Barra superior de navegación interna */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <Link href="/" className="text-emerald-800 hover:underline text-sm font-semibold">
          ← Volver al portal público del colegio
        </Link>
        
        <div className="flex items-center gap-3">
          <span className="text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold px-3 py-1.5 rounded-full">
            👤 {session?.fullName || 'Docente IPEM 10'} ({session?.role || 'DOCENTE'})
          </span>

          {session?.role === 'ADMIN' && (
            <Link
              href="/admin/circulares"
              className="text-xs bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-lg transition"
            >
              + Emitir Circular
            </Link>
          )}

          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs bg-red-900 hover:bg-red-800 text-white font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 shadow-sm"
              title="Cerrar la sesión docente"
            >
              <span>🚪</span> Cerrar Sesión
            </button>
          </form>
        </div>
      </div>

      <header className="mb-8">
        <span className="text-xs uppercase font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
          Área de Trabajo Exclusiva
        </span>
        <h1 className="text-3xl font-black text-gray-900 mt-2">Sala de Profesores Digital</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          IPEM N° 10 Roma • Comunicaciones internas, actas oficiales y recursos pedagógicos
        </p>
      </header>

      {/* Accesos Rápidos para el Docente */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <Link
          href="/admin/publicaciones/nueva"
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-emerald-500 transition text-center block"
        >
          <div className="text-2xl mb-1">📢</div>
          <p className="font-bold text-gray-800 text-sm">Publicar Noticia</p>
          <p className="text-xs text-gray-500">Para el portal público</p>
        </Link>

        <Link
          href="/admin/mesas"
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-emerald-500 transition text-center block"
        >
          <div className="text-2xl mb-1">📅</div>
          <p className="font-bold text-gray-800 text-sm">Mesas de Examen</p>
          <p className="text-xs text-gray-500">Cronograma y tribunales</p>
        </Link>

        <Link
          href="/admin/descargas"
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-emerald-500 transition text-center block"
        >
          <div className="text-2xl mb-1">📄</div>
          <p className="font-bold text-gray-800 text-sm">Subir Programa</p>
          <p className="text-xs text-gray-500">PDFs de materias</p>
        </Link>

        <a
          href="https://classroom.google.com"
          target="_blank"
          rel="noreferrer"
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-emerald-500 transition text-center block"
        >
          <div className="text-2xl mb-1">💻</div>
          <p className="font-bold text-gray-800 text-sm">Google Classroom</p>
          <p className="text-xs text-gray-500">Aulas virtuales institucionales</p>
        </a>
      </section>

      {/* Circulares internas y Repositorio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>📋</span> Circulares y Comunicados de Dirección
            </h2>
            <span className="text-xs text-gray-500">{activeMemos.length} comunicados vigentes</span>
          </div>

          {activeMemos.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border text-center text-gray-500">
              No hay circulares internas vigentes en este momento.
            </div>
          ) : (
            activeMemos.map((memo) => (
              <article
                key={memo.id}
                className={`bg-white border rounded-xl p-6 shadow-sm space-y-3 ${
                  memo.priority === 'URGENTE' ? 'border-l-4 border-l-red-600' : ''
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    {memo.priority === 'URGENTE' && (
                      <span className="bg-red-100 text-red-700 font-bold text-xs px-2.5 py-0.5 rounded-full mr-2">
                        Lectura Obligatoria
                      </span>
                    )}
                    <span className="text-xs font-bold text-emerald-800 uppercase">{memo.sender}</span>
                    <h3 className="font-bold text-gray-900 text-lg mt-1">{memo.title}</h3>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{memo.createdAt?.slice(0, 10)}</span>
                </div>

                <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                  {memo.content}
                </p>
              </article>
            ))
          )}
        </section>

        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-base border-b pb-2">
              📂 Modelos y Formularios Útiles
            </h3>
            <ul className="text-sm space-y-3 text-gray-700">
              <li className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span>Acta de Examen en Blanco</span>
                <span className="text-xs text-emerald-800 font-semibold cursor-pointer hover:underline">PDF ↓</span>
              </li>
              <li className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span>Planilla de Seguimiento Trimestral</span>
                <span className="text-xs text-emerald-800 font-semibold cursor-pointer hover:underline">Excel ↓</span>
              </li>
              <li className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span>Formulario de Licencias Docentes</span>
                <span className="text-xs text-emerald-800 font-semibold cursor-pointer hover:underline">PDF ↓</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Estructura de Proyecto FODEP</span>
                <span className="text-xs text-emerald-800 font-semibold cursor-pointer hover:underline">Word ↓</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
