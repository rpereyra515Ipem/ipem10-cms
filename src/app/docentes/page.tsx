import { db } from '@/db';
import { memos } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { logoutAction } from '@/actions/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SchoolLogo from '@/components/SchoolLogo';
import { desc } from 'drizzle-orm';

export default async function DocentesPage() {
  const session = await getSession();

  // Protección estricta: Solo personal autorizado puede acceder
  if (!session) {
    redirect('/acceso-institucional');
  }

  // Obtener circulares internas emitidas por Dirección
  const allMemos = await db.select().from(memos).orderBy(desc(memos.createdAt));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* 1. Barra de Navegación Institucional Homogénea */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <SchoolLogo size="md" className="group-hover:scale-105 transition transform" />
            <div className="hidden sm:block">
              <span className="font-black text-emerald-950 text-lg sm:text-xl block leading-tight tracking-tight">
                IPEM N° 10 Roma
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Sala de Profesores Digital
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botón Inicio de Alto Contraste con Relieve */}
            <Link
              href="/"
              className="text-[11px] sm:text-sm font-bold px-3 py-1.5 sm:py-2 rounded-lg text-slate-900 bg-slate-200 hover:bg-slate-300 border border-slate-400 shadow-sm transition flex items-center gap-1.5 whitespace-nowrap"
              title="Volver a la portada principal del IPEM 10"
            >
              <span>🏠</span>
              <span>Inicio</span>
            </Link>

            {/* Identificación del Docente Logueado */}
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 border border-emerald-300/80 text-emerald-950 px-3 py-1.5 rounded-lg text-xs font-bold">
              <span>👨‍🏫</span>
              <span>{session.fullName}</span>
              <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full uppercase ml-1">
                {session.role}
              </span>
            </div>

            {/* Botón de Cierre de Sesión Seguro */}
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-[11px] sm:text-sm font-bold px-3 py-1.5 sm:py-2 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 shadow-sm transition flex items-center gap-1 whitespace-nowrap"
                title="Cerrar sesión de forma segura"
              >
                <span>🚪</span>
                <span>Salir</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* 2. Banner de Cabecera con Colores Institucionales */}
      <div className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-green-950 text-white py-10 px-4 border-b border-emerald-800 shadow-inner">
        <div className="max-w-5xl mx-auto text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4">
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Área de Trabajo Exclusiva para el Cuerpo Docente
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-2.5">
              Sala de Profesores Digital
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm mt-1.5 max-w-2xl">
              Comunicaciones oficiales de Dirección, recursos curriculares, actas en blanco y mesas de examen del ciclo lectivo.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 shrink-0 hidden lg:block">
            <span className="text-4xl">📚</span>
          </div>
        </div>
      </div>

      {/* 3. Contenido Principal y Accesos Rápidos */}
      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        {/* Grilla de Herramientas Docentes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/mesas"
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition text-center group block"
          >
            <span className="text-2xl block mb-1.5 group-hover:scale-110 transition transform">📅</span>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Mesas de Examen</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Tribunales y fechas</p>
          </Link>

          <Link
            href="/descargas?cat=PROGRAMA"
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition text-center group block"
          >
            <span className="text-2xl block mb-1.5 group-hover:scale-110 transition transform">📑</span>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Programas de Materia</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Contenidos de 1° a 6°</p>
          </Link>

          <Link
            href="/preceptoria"
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-rose-400 hover:shadow-md transition text-center group block"
          >
            <span className="text-2xl block mb-1.5 group-hover:scale-110 transition transform">🧑‍🏫</span>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Preceptoría</h3>
            <p className="text-[10px] text-rose-600 font-semibold mt-0.5">Horas libres y cursos</p>
          </Link>

          <a
            href="https://classroom.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition text-center group block"
          >
            <span className="text-2xl block mb-1.5 group-hover:scale-110 transition transform">💻</span>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Google Classroom</h3>
            <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Aulas virtuales ↗</p>
          </a>
        </div>

        {/* Circulares Internas y Formularios */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Comunicados de Dirección */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <span>📋</span> Circulares y Comunicados de Dirección
              </h2>
              <span className="text-xs text-gray-500">{allMemos.length} comunicados</span>
            </div>

            {allMemos.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500 shadow-sm">
                <span className="text-3xl block mb-2">📬</span>
                <p className="font-bold text-sm">No hay circulares internas vigentes en este momento.</p>
                <p className="text-xs text-gray-400 mt-1">Los nuevos comunicados de Dirección aparecerán aquí.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allMemos.map((memo) => (
                  <div
                    key={memo.id}
                    className={`bg-white border rounded-2xl p-5 shadow-sm space-y-2.5 transition ${
                      memo.priority === 'URGENTE'
                        ? 'border-l-4 border-l-rose-500'
                        : 'border-l-4 border-l-emerald-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          memo.priority === 'URGENTE'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {memo.priority}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {memo.createdAt}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm">{memo.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                      {memo.content}
                    </p>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                      <span>Emitido por: <b>{memo.sender}</b></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Columna Derecha: Modelos de Documentos y Actas */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <span>📁</span> Modelos y Formularios Útiles
              </h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
              <p className="text-xs text-gray-500 leading-relaxed">
                Formatos oficiales para impresión y presentación en Secretaría escolar:
              </p>

              <div className="space-y-2">
                <Link
                  href="/descargas"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-gray-100 transition group"
                >
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-emerald-800">
                    📄 Acta de Examen en Blanco
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    PDF ↓
                  </span>
                </Link>

                <Link
                  href="/descargas"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-gray-100 transition group"
                >
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-emerald-800">
                    📊 Planilla de Seguimiento Trimestral
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                    Excel ↓
                  </span>
                </Link>

                <Link
                  href="/descargas"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-gray-100 transition group"
                >
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-emerald-800">
                    📑 Formulario de Licencias Docentes
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    PDF ↓
                  </span>
                </Link>

                <Link
                  href="/descargas"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-gray-100 transition group"
                >
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-emerald-800">
                    📝 Estructura de Proyecto FODEP
                  </span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                    Word ↓
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Pie Institucional */}
      <footer className="bg-emerald-950 text-emerald-300/80 py-6 text-center text-xs border-t border-emerald-900 mt-12">
        <p>© {new Date().getFullYear()} IPEM N° 10 Roma — Sala de Profesores Digital</p>
      </footer>
    </div>
  );
}
