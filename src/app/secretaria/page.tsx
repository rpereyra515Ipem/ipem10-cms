import Link from 'next/link';
import { getSession } from '@/lib/auth';
import SchoolLogo from '@/components/SchoolLogo';
import TramitePublicoClient from './TramitePublicoClient';

export const dynamic = 'force-dynamic';

export default async function SecretariaPage() {
    const session = await getSession();
    const hasSession = Boolean(session);
    const canAccessAdmin = session && ['MASTER', 'DIRECTIVO', 'SECRETARIA', 'ADMIN'].includes(session.role);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Header Institucional Unificado */}
            <header className="bg-emerald-950 border-b-4 border-amber-500 text-white shadow-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="p-1 bg-emerald-900/80 rounded-xl border border-amber-400/40 group-hover:scale-105 transition transform shadow-xs">
                            <SchoolLogo size="md" className="drop-shadow-sm" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                                    IPEM N° 10 Roma
                                </span>
                                <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded-full text-emerald-200 border border-emerald-800">
                                    CUE: 1404728-00
                                </span>
                            </div>
                            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                                <span>🏢</span>
                                <span>Secretaría Docente y Administrativa</span>
                            </h1>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Botón Inicio Estandarizado con Icono */}
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all border border-emerald-700/80 shadow-xs"
                            title="Volver a la portada principal del IPEM 10"
                        >
                            <span>🏠</span>
                            <span>Inicio</span>
                        </Link>

                        {/* Botón Dinámico: Panel de Gestión para Secretaría / Directivos o Acceso Personal para visitantes */}
                        {canAccessAdmin ? (
                            <Link
                                href="/admin"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black bg-amber-400 hover:bg-amber-300 text-emerald-950 transition-all shadow-md transform hover:-translate-y-0.5"
                                title="Volver al Panel de Gestión Escolar"
                            >
                                <span>⚙️</span>
                                <span>Panel de Gestión</span>
                            </Link>
                        ) : (
                            <Link
                                href="/acceso-institucional"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-300 text-emerald-950 transition-colors shadow-sm"
                            >
                                <span>🔒</span>
                                <span>Acceso Personal</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Banner de Horarios y Ventanilla Única */}
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700 border border-emerald-100 text-2xl">
                                ⏰
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Horario de Atención</h3>
                                <p className="text-sm text-slate-600 mt-1">
                                    <strong>Turno Mañana:</strong> 08:00 a 12:30 hs.<br />
                                    <strong>Turno Tarde:</strong> 13:30 a 18:00 hs.
                                </p>
                                <span className="text-xs text-slate-500">Planta Baja - Ala Administrativa</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-50 rounded-xl text-amber-700 border border-amber-100 text-2xl">
                                ✉️
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Contacto Oficial</h3>
                                <p className="text-sm text-slate-600 mt-1">
                                    <a href="mailto:secretaria@ipem10.edu.ar" className="text-emerald-700 hover:underline font-semibold">
                                        secretaria@ipem10.edu.ar
                                    </a>
                                    <br />
                                    Padre Lozano 375, Alto Alberdi.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl text-blue-700 border border-blue-100 text-2xl">
                                📋
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Plazos de Confección</h3>
                                <p className="text-sm text-slate-600 mt-1">
                                    Constancias y firmas: <strong>48 a 72 hs hábiles</strong>.<br />
                                    Certificados analíticos: según Libro Matriz.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Panel Administrativo (Visible solo para personal con sesión activa) */}
                {hasSession && (
                    <section className="bg-gradient-to-r from-emerald-950 to-emerald-900 rounded-2xl p-6 text-white shadow-md border-2 border-amber-500/40">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-amber-400 text-emerald-950">
                                    Gestión Operativa de Secretaría
                                </div>
                                <h2 className="text-xl font-bold text-white mt-1">Panel de Control Interno</h2>
                                <p className="text-sm text-emerald-200 mt-0.5">
                                    Bandeja de solicitudes de alumnos, novedades de POF y carga masiva de docentes.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    href="/admin/secretaria/tramites"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow"
                                >
                                    <span>📥</span>
                                    <span>Bandeja de Trámites</span>
                                </Link>

                                <Link
                                    href="/secretaria/carga-masiva"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm transition shadow"
                                >
                                    <span>👥</span>
                                    <span>Carga Masiva Docente</span>
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* ========================================================= */}
                {/* COMPONENTE INTERACTIVO PÚBLICO: SOLICITUDES Y CONSULTAS */}
                {/* ========================================================= */}
                <section className="space-y-4">
                    <div className="border-b border-slate-200 pb-2">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <span>📄</span>
                            <span>Mesa de Entradas Digital para Alumnos y Familias</span>
                        </h2>
                        <p className="text-xs text-slate-500">
                            Solicitá tu constancia o consultá si tu documento ya está firmado sin moverte de tu casa.
                        </p>
                    </div>

                    <TramitePublicoClient />
                </section>

                {/* Formularios Escolares Públicos y CUS */}
                <section className="space-y-4">
                    <div className="border-b border-slate-200 pb-2">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <span>📥</span>
                            <span>Formularios Oficiales y Salud Escolar (Descarga Libre)</span>
                        </h2>
                        <p className="text-xs text-slate-500">Documentación oficial para descargar, imprimir y presentar en el colegio.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* CUS */}
                        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-500/30 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-all">
                            <div>
                                <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                                    Salud Escolar Obligatoria
                                </span>
                                <h4 className="font-bold text-slate-800 text-sm mt-2.5">CUS (Certificado Único de Salud)</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Formulario oficial provincial para Educación Física y ficha médica anual.
                                </p>
                            </div>
                            <a
                                href="https://ipem10.edu.ar/descargas/CUS-Formulario-Oficial-Cordoba.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors shadow-sm"
                            >
                                <span>Descargar CUS (PDF)</span>
                            </a>
                        </div>

                        {/* ISA */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-all">
                            <div>
                                <span className="text-[10px] font-bold uppercase text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full">
                                    Ficha Médica
                                </span>
                                <h4 className="font-bold text-slate-800 text-sm mt-2.5">ISA (Informe de Salud del Alumno)</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Declaración jurada de antecedentes médicos que acompaña al CUS.
                                </p>
                            </div>
                            <a
                                href="https://ipem10.edu.ar/descargas/ISA-Informe-Salud-Alumno.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 text-xs font-semibold transition-colors border border-blue-200"
                            >
                                <span>Descargar ISA (PDF)</span>
                            </a>
                        </div>

                        {/* Ficha de Matrícula */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-all">
                            <div>
                                <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
                                    Inscripción
                                </span>
                                <h4 className="font-bold text-slate-800 text-sm mt-2.5">Ficha de Inscripción y Matrícula</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Actualización de datos de tutores, domicilio y contacto.
                                </p>
                            </div>
                            <a
                                href="https://ipem10.edu.ar/descargas/Ficha-Inscripcion-IPEM10.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-semibold transition-colors border border-amber-200"
                            >
                                <span>Descargar Ficha (PDF)</span>
                            </a>
                        </div>

                        {/* Salidas Escolares */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-all">
                            <div>
                                <span className="text-[10px] font-bold uppercase text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full">
                                    Autorizaciones
                                </span>
                                <h4 className="font-bold text-slate-800 text-sm mt-2.5">Salidas Escolares</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Consentimiento parental para salidas pedagógicas y torneos.
                                </p>
                            </div>
                            <a
                                href="https://ipem10.edu.ar/descargas/Autorizacion-Salidas-Escolares.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 text-xs font-semibold transition-colors border border-purple-200"
                            >
                                <span>Descargar PDF</span>
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800 mt-12">
                <p>IPEM N° 10 "Roma" — Alto Alberdi, Córdoba Capital.</p>
                <p className="mt-1 text-slate-500">Módulo de Secretaría General — Plataforma Web Institucional</p>
            </footer>
        </div>
    );
}