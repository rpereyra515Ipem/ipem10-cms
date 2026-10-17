import { db } from '@/db';
import { memos } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { logoutAction } from '@/actions/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SchoolLogo from '@/components/SchoolLogo';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function DocentesPage() {
  const session = await getSession();

  // Protección estricta: Solo personal autenticado puede acceder
  if (!session) {
    redirect('/acceso-institucional');
  }

  // Comprobar si el rol tiene privilegios administrativos
  const canAccessAdmin = ['MASTER', 'DIRECTIVO', 'SECRETARIA', 'PRECEPTOR'].includes(session.role);

  // Obtener circulares internas emitidas por Dirección
  const allMemos = await db.select().from(memos).orderBy(desc(memos.createdAt));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* 1. Barra de Navegación Institucional Homogénea */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="p-1.5 bg-emerald-900/10 rounded-2xl border border-emerald-900/20 group-hover:scale-105 transition-transform duration-300">
              <SchoolLogo size="md" className="drop-shadow-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-base sm:text-lg block leading-tight tracking-tight group-hover:text-emerald-900 transition-colors">
                  IPEM N° 10 Roma
                </span>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300/80 text-[10px] font-black px-2 py-0.5 rounded-full">
                  CUE 1404728-00
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium hidden sm:block">
                Sala de Profesores Digital • Padre Lozano 375
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botón Inicio */}
            <Link
              href="/"
              className="text-xs sm:text-sm font-bold px-3 py-2 rounded-xl text-slate-700 hover:text-emerald-900 hover:bg-slate-100 border border-slate-200 transition inline-flex items-center gap-1.5 shadow-xs"
              title="Volver a la portada principal del IPEM 10"
            >
              <span>🏠</span>
              <span>Inicio</span>
            </Link>

            {/* Botón Exclusivo para volver a Gestión (Secretaría, Directivos, Preceptores y Master) */}
            {canAccessAdmin && (
              <Link
                href="/admin"
                className="text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl text-white bg-emerald-900 hover:bg-emerald-950 border border-emerald-800 shadow-sm transition inline-flex items-center gap-1.5 whitespace-nowrap"
                title="Volver al Panel de Gestión Escolar"
              >
                <span>⚙️</span>
                <span>Panel de Gestión</span>
              </Link>
            )}

            {/* Identificación del Personal Logueado */}
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 text-emerald-950 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs">
              <span>👤</span>
              <span className="max-w-[150px] truncate">{session.fullName}</span>
              <span className="text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded-full uppercase ml-1">
                {session.role}
              </span>
            </div>

            {/* Botón de Cierre de Sesión Seguro */}
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 shadow-xs transition inline-flex items-center gap-1 whitespace-nowrap"
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
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white py-12 px-4 sm:px-6 relative overflow-hidden shadow-inner">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 sm:flex sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Área de Trabajo Exclusiva para el Cuerpo Docente
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-1">
              Sala de Profesores Digital
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Comunicaciones oficiales de Dirección, recursos curriculares, actas en blanco y mesas de examen del ciclo lectivo.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 shrink-0 hidden lg:block">
            <span className="text-5xl">📚</span>
          </div>
        </div>
      </section>

      {/* 3. Contenido Principal y Accesos Rápidos */}
      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        {/* Grilla de Herramientas Docentes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/mesas"
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition text-center group block"
          >
            <span className="text-2xl block mb-1.5 group-hover:scale-110 transition transform">📅</span>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Mesas de Examen</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Tribunales y fechas</p>
          </Link>

          <Link
            href="/descargas?cat=PROGRAMA"
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition text-center group block"
          >
            <span className="text-2xl block mb-1.5 group-hover:scale-110 transition transform">📑</span>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Programas de Materia</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Contenidos de 1° a 6°</p>
          </Link>

          <Link
            href="/preceptoria"
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-400 hover:shadow-md transition text-center group block"
          >
            <span className="text-2xl block mb-1.5 group-hover:scale-110 transition transform">🧑‍🏫</span>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm">Preceptoría</h3>
            <p className="text-[10px] text-rose-600 font-semibold mt-0.5">Horas libres y cursos</p>
          </Link>

          <a
            href="https://classroom.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition text-center group block"
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
                    className={`bg-white border rounded-2xl p-5 shadow-sm space-y-2.5 transition ${memo.priority === 'URGENTE'
                        ? 'border-l-4 border-l-rose-500'
                        : 'border-l-4 border-l-emerald-600'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${memo.priority === 'URGENTE'
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

      {/* 4. Pie de Página Institucional Oficial */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <SchoolLogo size="sm" className="opacity-90" />
            <span className="text-sm font-black text-white">IPEM N° 10 Roma</span>
            <span className="text-xs text-emerald-400 font-bold">• CUE 1404728-00</span>
          </div>

          <p className="text-xs text-slate-400">
            Padre Lozano 375, Barrio Alto Alberdi, Córdoba Capital • Tel: (0351) 4347871
          </p>

          <p className="text-[11px] text-slate-500">
            Líneas de colectivo: 40, 41, 42, 44, 70, 72 y 80
          </p>

          <p className="text-[11px] text-slate-600 pt-2 border-t border-slate-900">
            © {new Date().getFullYear()} IPEM N° 10 Roma — Sala de Profesores Digital
          </p>
        </div>
      </footer>
    </div>
  );
}