import { getPreceptoriaNotices, createPreceptoriaNoticeAction, deletePreceptoriaNoticeAction } from '@/actions/preceptoria';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import SchoolLogo from '@/components/SchoolLogo';

export default async function PreceptoriaPage() {
  const session = await getSession();
  const notices = await getPreceptoriaNotices();
  const canPublish = session && ['MASTER', 'DIRECTIVO', 'ADMIN', 'PRECEPTOR'].includes(session.role);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Barra de Navegación Superior */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <SchoolLogo size="md" className="group-hover:scale-105 transition transform" />
            <div className="hidden sm:block">
              <span className="font-black text-emerald-950 text-lg sm:text-xl block leading-tight tracking-tight">
                IPEM N° 10 Roma
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Portal de Preceptoría y Vida Escolar
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition whitespace-nowrap"
            >
              ← Inicio
            </Link>
            <Link
              href="/docentes"
              className="text-xs sm:text-sm font-bold px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-emerald-950 bg-emerald-100/70 hover:bg-emerald-200/80 border border-emerald-300/80 transition flex items-center gap-1 whitespace-nowrap"
            >
              <span>👨‍🏫</span>
              <span>Docentes</span>
            </Link>
            <Link
              href="/login"
              className="text-xs sm:text-sm font-bold px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-white bg-slate-900 hover:bg-emerald-900 transition flex items-center gap-1 shadow-sm whitespace-nowrap"
            >
              <span>🔒</span>
              <span>Gestión</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero del Módulo */}
      <div className="bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-900 text-white py-10 px-4 shadow-inner">
        <div className="max-w-4xl mx-auto text-center">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-400/30">
            Comunicación Oficial Diaria
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-3">
            Módulo de Preceptoría y Cursos
          </h1>
          <p className="text-emerald-100/80 text-sm mt-2 max-w-xl mx-auto">
            Avisos de horas libres, modificaciones de horario de ingreso/salida, citaciones a familias y circulares operativas por curso.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">
        {/* Panel Exclusivo para Preceptores y Directivos */}
        {canPublish && (
          <div className="bg-white border-2 border-emerald-600/30 rounded-xl p-6 shadow-md mb-10">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
                  <span>📝</span> Publicar Novedad de Preceptoría
                </h2>
                <p className="text-xs text-gray-500">Sesión activa como: <b>{session.fullName}</b> ({session.role})</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                Modo Edición
              </span>
            </div>

            <form action={createPreceptoriaNoticeAction} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tipo de Aviso</label>
                  <select name="type" className="w-full text-xs p-2 border rounded-lg bg-gray-50 focus:bg-white" required>
                    <option value="HORA_LIBRE">🚨 Hora Libre / Retiro</option>
                    <option value="CAMBIO_HORARIO">⏰ Cambio de Horario</option>
                    <option value="CITACION_FAMILIA">✉️ Citación a Familias</option>
                    <option value="COMUNICADO_CURSO">📢 Comunicado de Curso</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Año / Curso</label>
                  <select name="yearLevel" className="w-full text-xs p-2 border rounded-lg bg-gray-50 focus:bg-white" required>
                    <option value="TODOS">Todos los cursos</option>
                    <option value="1° Año">1° Año</option>
                    <option value="2° Año">2° Año</option>
                    <option value="3° Año">3° Año</option>
                    <option value="4° Año">4° Año</option>
                    <option value="5° Año">5° Año</option>
                    <option value="6° Año">6° Año</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">División</label>
                  <select name="division" className="w-full text-xs p-2 border rounded-lg bg-gray-50 focus:bg-white" required>
                    <option value="TODAS">Todas</option>
                    <option value="A">División A</option>
                    <option value="B">División B</option>
                    <option value="C">División C</option>
                    <option value="D">División D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Turno</label>
                  <select name="shift" className="w-full text-xs p-2 border rounded-lg bg-gray-50 focus:bg-white" required>
                    <option value="MAÑANA">Turno Mañana</option>
                    <option value="TARDE">Turno Tarde</option>
                    <option value="AMBOS">Ambos Turnos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Título del Aviso</label>
                  <input
                    name="title"
                    placeholder="Ej: 3° B ingresa a las 08:50 por ausencia de Matemática"
                    className="w-full text-xs p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Fecha en que aplica</label>
                  <input
                    type="date"
                    name="effectiveDate"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full text-xs p-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Detalle del Comunicado</label>
                <textarea
                  name="content"
                  rows={3}
                  placeholder="Escriba las aclaraciones pertinentes para alumnos y familias..."
                  className="w-full text-xs p-2 border rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition"
                >
                  🚀 Publicar Novedad de Preceptoría
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Listado de Novedades de Preceptoría */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
              <span>📋</span> Novedades y Avisos Vigentes
            </h3>
            <span className="text-xs text-gray-500">{notices.length} avisos registrados</span>
          </div>

          {notices.length === 0 ? (
            <div className="bg-white border rounded-xl p-8 text-center text-gray-500 shadow-sm">
              <span className="text-3xl block mb-2">🎉</span>
              <p className="font-semibold text-sm">No hay avisos de preceptoría ni horas libres registradas.</p>
              <p className="text-xs text-gray-400 mt-1">El cronograma escolar se desarrolla con total normalidad.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notices.map((n) => {
                const isHoraLibre = n.type === 'HORA_LIBRE';
                const isCitacion = n.type === 'CITACION_FAMILIA';
                const isCambio = n.type === 'CAMBIO_HORARIO';

                return (
                  <div
                    key={n.id}
                    className={`bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between ${
                      isHoraLibre
                        ? 'border-l-4 border-l-rose-500'
                        : isCitacion
                        ? 'border-l-4 border-l-purple-500'
                        : isCambio
                        ? 'border-l-4 border-l-amber-500'
                        : 'border-l-4 border-l-emerald-500'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isHoraLibre
                              ? 'bg-rose-100 text-rose-800'
                              : isCitacion
                              ? 'bg-purple-100 text-purple-800'
                              : isCambio
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {n.type.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          📅 {n.effectiveDate}
                        </span>
                      </div>

                      <h4 className="font-bold text-gray-900 text-sm leading-snug">{n.title}</h4>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed whitespace-pre-line">{n.content}</p>

                      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                        <span>
                          📍 <b>{n.yearLevel} {n.division}</b> ({n.shift})
                        </span>
                        <span>✍️ {n.authorName}</span>
                      </div>
                    </div>

                    {canPublish && (
                      <div className="mt-3 pt-2 border-t flex justify-end">
                        <form
                          action={async () => {
                            'use server';
                            await deletePreceptoriaNoticeAction(n.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-[11px] text-rose-600 hover:text-rose-800 font-bold hover:underline"
                          >
                            🗑️ Eliminar aviso
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Pie de página institucional */}
      <footer className="bg-emerald-950 text-emerald-200 py-6 text-center text-xs border-t border-emerald-900 mt-12">
        <p>© {new Date().getFullYear()} IPEM N° 10 Roma — Módulo Oficial de Preceptoría</p>
      </footer>
    </div>
  );
}
