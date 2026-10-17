import { getPreceptoriaNotices, createPreceptoriaNoticeAction, deletePreceptoriaNoticeAction } from '@/actions/preceptoria';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import SchoolLogo from '@/components/SchoolLogo';

export const dynamic = 'force-dynamic';

export default async function PreceptoriaPage() {
  const session = await getSession();
  const notices = await getPreceptoriaNotices();
  const canPublish = session && ['MASTER', 'DIRECTIVO', 'ADMIN', 'PRECEPTOR'].includes(session.role);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Barra de Navegación Superior Institucional */}
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
                Padre Lozano 375 • Alto Alberdi, Córdoba
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="text-xs sm:text-sm font-bold px-3 py-2 rounded-xl text-slate-700 hover:text-emerald-900 hover:bg-slate-100 transition inline-flex items-center gap-1.5"
            >
              <span>🏛️</span>
              <span className="hidden sm:inline">Institucional</span>
            </Link>
            <Link
              href="/docentes"
              className="text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl text-emerald-950 bg-emerald-100/80 hover:bg-emerald-200/90 border border-emerald-300 transition inline-flex items-center gap-1.5 shadow-xs"
            >
              <span>👨‍🏫</span>
              <span>Docentes</span>
            </Link>
            <Link
              href="/acceso-institucional"
              className="text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl text-white bg-slate-900 hover:bg-emerald-950 transition inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>🔒</span>
              <span>Gestión</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero del Módulo con Degradé Esmeralda Profundo */}
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white py-12 px-4 sm:px-6 relative overflow-hidden shadow-inner">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider border border-emerald-400/30 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Comunicación Oficial y Vida Escolar</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
            Módulo de Preceptoría y Cursos
          </h1>

          <p className="text-emerald-100/90 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-normal">
            Avisos de horas libres, modificaciones de horario de ingreso y egreso, citaciones a familias y circulares operativas por curso en tiempo real.
          </p>
        </div>
      </section>

      {/* Franja de Información Operativa de Turnos Escolares y Orientaciones */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-20 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Turno Mañana: Bachiller en Informática */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-md flex items-center gap-3">
            <span className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-2xl shrink-0">💻</span>
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">Turno Mañana</span>
              <span className="text-emerald-800 font-bold block">Bachiller en Informática</span>
              <span className="text-slate-500 text-[11px]">07:30 a 12:50 hs</span>
            </div>
          </div>

          {/* Turno Tarde: Bachiller en Programación y Robótica */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-md flex items-center gap-3">
            <span className="p-2.5 bg-amber-50 text-amber-800 rounded-xl text-2xl shrink-0">🤖</span>
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">Turno Tarde</span>
              <span className="text-amber-800 font-bold block">Bachiller en Programación y Robótica</span>
              <span className="text-slate-500 text-[11px]">13:15 a 18:35 hs</span>
            </div>
          </div>

          {/* Contacto y Justificaciones con Teléfono Oficial */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-md flex items-center gap-3">
            <span className="p-2.5 bg-teal-50 text-teal-800 rounded-xl text-2xl shrink-0">📞</span>
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">Preceptoría y Guardia</span>
              <span className="text-teal-900 font-bold block">(0351) 4347871</span>
              <span className="text-slate-500 text-[11px]">Justificaciones hasta 48 hs hábiles</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-10 w-full flex-1">
        {/* Panel Exclusivo para Preceptores y Directivos */}
        {canPublish && (
          <div className="bg-white border-2 border-emerald-600/30 rounded-3xl p-6 sm:p-8 shadow-lg mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  Panel de Gestión Activo
                </span>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mt-1">
                  <span>📝</span> Publicar Novedad de Preceptoría
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sesión activa: <b className="text-slate-700">{session.fullName}</b> ({session.role})
                </p>
              </div>

              <span className="text-xs bg-emerald-700 text-white font-bold px-3 py-1 rounded-xl shadow-xs self-start sm:self-auto">
                Modo Edición Habilitado
              </span>
            </div>

            <form action={createPreceptoriaNoticeAction} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Tipo de Aviso</label>
                  <select name="type" className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none transition font-medium" required>
                    <option value="HORA_LIBRE">🚨 Hora Libre / Retiro</option>
                    <option value="CAMBIO_HORARIO">⏰ Cambio de Horario</option>
                    <option value="CITACION_FAMILIA">✉️ Citación a Familias</option>
                    <option value="COMUNICADO_CURSO">📢 Comunicado de Curso</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Año / Curso</label>
                  <select name="yearLevel" className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none transition font-medium" required>
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
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">División</label>
                  <select name="division" className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none transition font-medium" required>
                    <option value="TODAS">Todas las divisiones</option>
                    <option value="A">División A</option>
                    <option value="B">División B</option>
                    <option value="C">División C</option>
                    <option value="D">División D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Turno</label>
                  <select name="shift" className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none transition font-medium" required>
                    <option value="MAÑANA">Turno Mañana</option>
                    <option value="TARDE">Turno Tarde</option>
                    <option value="AMBOS">Ambos Turnos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Título del Aviso</label>
                  <input
                    name="title"
                    placeholder="Ej: 3° B ingresa a las 08:50 hs por ausencia justificada"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none transition font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Fecha de Aplicación</label>
                  <input
                    type="date"
                    name="effectiveDate"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none transition font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Detalle del Comunicado</label>
                <textarea
                  name="content"
                  rows={3}
                  placeholder="Escriba las aclaraciones pertinentes para estudiantes y familias..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none transition font-normal"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  🚀 Publicar Novedad de Preceptoría
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Listado de Novedades de Preceptoría */}
        <div>
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-black text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                <span>📋</span> Tablero de Novedades y Avisos Vigentes
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Información actualizada para familias y alumnos</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              {notices.length} avisos activos
            </span>
          </div>

          {notices.length === 0 ? (
            /* Estado Vacío Heráldico Institucional */
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xs">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 shadow-xs">
                  <SchoolLogo size="lg" className="drop-shadow-sm" />
                </div>
              </div>
              <h4 className="font-black text-slate-900 text-base sm:text-lg">
                Sin horas libres ni novedades operativas registradas
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                El cronograma de actividades de ambos turnos (Mañana: Bachiller en Informática / Tarde: Bachiller en Programación y Robótica) se desarrolla con total normalidad.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-900">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Ciclo Lectivo 2026 • Estado Normal</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {notices.map((n) => {
                const isHoraLibre = n.type === 'HORA_LIBRE';
                const isCitacion = n.type === 'CITACION_FAMILIA';
                const isCambio = n.type === 'CAMBIO_HORARIO';

                return (
                  <div
                    key={n.id}
                    className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between ${isHoraLibre
                      ? 'border-l-4 border-l-rose-500'
                      : isCitacion
                        ? 'border-l-4 border-l-purple-500'
                        : isCambio
                          ? 'border-l-4 border-l-amber-500'
                          : 'border-l-4 border-l-emerald-500'
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${isHoraLibre
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
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                          📅 {n.effectiveDate}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-base leading-snug">{n.title}</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">{n.content}</p>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                          📍 <b>{n.yearLevel} {n.division}</b> ({n.shift})
                        </span>
                        <span>✍️ {n.authorName}</span>
                      </div>
                    </div>

                    {canPublish && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                        <form
                          action={async () => {
                            'use server';
                            await deletePreceptoriaNoticeAction(n.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-xs text-rose-600 hover:text-rose-800 font-bold hover:underline inline-flex items-center gap-1"
                          >
                            <span>🗑️</span>
                            <span>Eliminar aviso</span>
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

      {/* Pie de página institucional oficial */}
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
            © {new Date().getFullYear()} IPEM N° 10 Roma — Portal Oficial de Preceptoría y Vida Escolar
          </p>
        </div>
      </footer>
    </div>
  );
}