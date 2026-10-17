import { db } from '@/db';
import { posts, exams, documents, memos, users, auditSecurityLogs } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { sql, and, gte, inArray, desc } from 'drizzle-orm';
import MaintenanceToggleClient from './MaintenanceToggleClient';
import AuditLogsTableClient from './AuditLogsTableClient';
import GestionModulesAccordion from './GestionModulesAccordion';

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/acceso-institucional');
  }

  const isMaster = session.role === 'MASTER';
  const isSecretaria = session.role === 'SECRETARIA';
  const isDirectivo = session.role === 'DIRECTIVO';
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true';

  // Métricas escolares
  const [postsCount] = await db.select({ count: sql<number>`count(*)` }).from(posts);
  const [examsCount] = await db.select({ count: sql<number>`count(*)` }).from(exams);
  const [documentsCount] = await db.select({ count: sql<number>`count(*)` }).from(documents);
  const [memosCount] = await db.select({ count: sql<number>`count(*)` }).from(memos);
  const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(users);

  // Métricas exclusivas para el MASTER
  let auditTotal = 0;
  let criticalTotal = 0;
  let recentAuditLogs: any[] = [];

  if (isMaster) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateStr = sevenDaysAgo.toISOString();

    const [totalAuditRes] = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditSecurityLogs)
      .where(gte(auditSecurityLogs.timestamp, dateStr));
    auditTotal = totalAuditRes?.count || 0;

    const [critRes] = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditSecurityLogs)
      .where(
        and(
          gte(auditSecurityLogs.timestamp, dateStr),
          inArray(auditSecurityLogs.severity, ['CRITICAL', 'HIGH'])
        )
      );
    criticalTotal = critRes?.count || 0;

    recentAuditLogs = await db
      .select()
      .from(auditSecurityLogs)
      .orderBy(desc(auditSecurityLogs.timestamp))
      .limit(10);
  }

  return (
    <div className="space-y-8">
      {/* ========================================================= */}
      {/* 1. CABECERA DIFERENCIADA POR ROL */}
      {/* ========================================================= */}
      {isMaster ? (
        <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 border-2 border-amber-500/70 shadow-2xl rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  👑 ROL: MASTER / WEBMASTER
                </span>
                <span className="bg-purple-500/30 text-purple-200 border border-purple-400/40 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Control Total de Infraestructura
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  🛡️ Ciberseguridad L7 Activa
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Consola de Control Técnico & Auditoría
              </h1>
              <p className="text-purple-200/80 text-xs sm:text-sm mt-1">
                Sesión técnica iniciada por: <strong className="text-amber-300 font-bold">{session.fullName}</strong> ({session.userId})
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/admin/usuarios"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
              >
                <span>👥</span> Gestionar Personal y Roles
              </Link>
            </div>
          </div>
        </div>
      ) : isSecretaria ? (
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border-2 border-amber-500/50 shadow-lg rounded-2xl p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-amber-400 text-emerald-950 font-black text-xs px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  🏢 ROL: SECRETARÍA ESCOLAR Y PERSONAL
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Área Administrativa y POF
                </span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Panel de Secretaría Docente y Gestión de Alumnos
              </h1>
              <p className="text-emerald-200/80 text-xs sm:text-sm mt-1">
                Bienvenido/a, <strong className="text-white font-bold">{session.fullName}</strong>. Gestión de nómina, constancias y trámites.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/secretaria/carga-masiva"
                className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
              >
                <span>📥</span> Carga Masiva (CSV / Sheets)
              </Link>
              <Link
                href="/admin/usuarios"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition"
              >
                👥 Nómina
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border border-emerald-800 shadow-lg rounded-2xl p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold px-3 py-0.5 rounded-full uppercase">
                  🏛️ ROL: EQUIPO DIRECTIVO
                </span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Panel de Administración y Gestión Escolar
              </h1>
              <p className="text-emerald-200/80 text-xs sm:text-sm mt-1">
                Bienvenido/a, <strong className="text-white font-bold">{session.fullName}</strong>.
              </p>
            </div>
            <Link
              href="/admin/usuarios"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2 rounded-xl border border-white/20 transition self-start sm:self-auto"
            >
              👥 Ver Personal
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CONSOLA TÉCNICA E INSPECCIÓN FORENSE (SOLO PARA EL MASTER) */}
      {/* ========================================================= */}
      {isMaster && (
        <div className="bg-slate-900 border border-purple-900/60 rounded-2xl p-6 shadow-xl text-white space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>🛡️</span> Métricas de Ciberseguridad y Salud del Sistema
              </h2>
              <p className="text-xs text-slate-400">Datos forenses en tiempo real desde <code>audit_security_logs</code>.</p>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full font-bold">
              VPS DonWeb Activo
            </span>
          </div>

          {/* Interruptor Maestro de Mantenimiento */}
          <MaintenanceToggleClient initialIsMaintenance={isMaintenance} />

          {/* Métricas del Master */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 block mb-1">Eventos Auditados (7 días)</span>
              <span className="text-3xl font-black text-purple-400">{auditTotal}</span>
              <span className="text-[11px] text-slate-500 block mt-1">Registros con IP y User-Agent</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 block mb-1">Alertas Críticas / Altas</span>
              <span className="text-3xl font-black text-amber-400">{criticalTotal}</span>
              <span className="text-[11px] text-slate-500 block mt-1">Intentos fallidos o bloqueos</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 block mb-1">Cuentas Registradas</span>
              <span className="text-3xl font-black text-emerald-400">{usersCount.count}</span>
              <Link href="/admin/usuarios" className="text-[11px] text-emerald-400 hover:underline block mt-1 font-bold">
                Gestionar personal →
              </Link>
            </div>
          </div>

          {/* Tabla Interactiva con Clic para Inspección Forense */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Últimos eventos registrados en el servidor
              </h3>
              <span className="text-[11px] text-purple-400 font-sans font-semibold">
                👆 Haz clic en cualquier fila para inspeccionar payload y User-Agent
              </span>
            </div>
            <AuditLogsTableClient initialLogs={recentAuditLogs} />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MÓDULOS DE GESTIÓN ESCOLAR (COLAPSABLE PARA EL MASTER) */}
      {/* ========================================================= */}
      <GestionModulesAccordion isMaster={isMaster}>
        {/* Contadores Escolares */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-2xl font-black text-emerald-950 block">{postsCount.count}</span>
            <span className="text-xs text-gray-500 font-medium">Noticias y avisos</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-2xl font-black text-emerald-950 block">{examsCount.count}</span>
            <span className="text-xs text-gray-500 font-medium">Mesas de examen</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-2xl font-black text-emerald-950 block">{documentsCount.count}</span>
            <span className="text-xs text-gray-500 font-medium">Programas y PDFs</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-2xl font-black text-emerald-950 block">{memosCount.count}</span>
            <span className="text-xs text-gray-500 font-medium">Circulares emitidas</span>
          </div>
        </div>

        {/* Tarjetas de acceso a módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tarjeta de Secretaría, Personal y Gestión de MAB */}
          <div className="bg-white rounded-2xl border-2 border-emerald-500/50 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🏢</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Personal & POF
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-base">Secretaría y Planta Docente</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                Novedades de personal, altas individuales, carga masiva y enlace oficial a CiDi para trámites de MAB provincial.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
              {/* 1. Alta Individual de Docente */}
              <Link
                href="/admin/usuarios"
                className="text-xs font-bold px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm transition inline-flex items-center gap-1"
                title="Cargar un nuevo docente individualmente"
              >
                <span>➕</span>
                <span>Alta Docente</span>
              </Link>

              {/* 2. Carga Masiva (CSV / Google Sheets) */}
              <Link
                href="/secretaria/carga-masiva"
                className="text-xs font-bold px-3 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 rounded-lg shadow-sm transition inline-flex items-center gap-1"
                title="Importación masiva mediante CSV o Google Sheets"
              >
                <span>📥</span>
                <span>Carga Masiva</span>
              </Link>

              {/* 3. Ver Nómina Completa */}
              <Link
                href="/admin/usuarios"
                className="text-xs font-bold px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300 transition inline-flex items-center gap-1"
                title="Ver nómina de personal y roles"
              >
                <span>👥</span>
                <span>Nómina</span>
              </Link>

              {/* 4. Enlace Directo a Ciudadano Digital (CiDi) para MAB */}
              <a
                href="https://cidi.cba.gov.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold px-3 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg shadow-sm transition inline-flex items-center gap-1"
                title="Acceso directo a CiDi (Gobierno de Córdoba) para confección de MAB y Recursos Humanos"
              >
                <span>🏛️</span>
                <span>CiDi (MAB) ↗</span>
              </a>

              {/* 5. Acceso al Portal Público de Secretaría */}
              <Link
                href="/secretaria"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition ml-auto inline-flex items-center gap-0.5"
              >
                <span>Ver Portal →</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">📢</div>
              <h3 className="font-bold text-gray-900 text-base">Noticias y Comunicados Públicos</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                Crea avisos urgentes para la portada, comunicados generales con imágenes y novedades para la comunidad educativa.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/publicaciones" className="text-xs font-bold px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700">
                Ver Listado
              </Link>
              <Link href="/admin/publicaciones/nueva" className="text-xs font-bold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow">
                + Nueva Noticia
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">📅</div>
              <h3 className="font-bold text-gray-900 text-base">Cronograma de Mesas de Examen</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                Administra las fechas, horarios, turnos, aulas y tribunales de materias previas, libres y equivalencias.
              </p>
            </div>
            <Link href="/admin/mesas" className="text-xs font-bold px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow inline-block text-center">
              Gestionar Mesas de Examen →
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">📁</div>
              <h3 className="font-bold text-gray-900 text-base">Programas de Estudio y Descargas</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                Sube y actualiza los PDFs de los programas de 1° a 6° año y los formularios descargables para familias.
              </p>
            </div>
            <Link href="/admin/descargas" className="text-xs font-bold px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow inline-block text-center">
              Gestionar Repositorio de PDFs →
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-bold text-gray-900 text-base">Circulares Internas Docentes</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                Emite comunicados exclusivos para directivos, docentes y preceptores en la Sala de Profesores Digital.
              </p>
            </div>
            <Link href="/admin/circulares" className="text-xs font-bold px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg shadow inline-block text-center">
              Gestionar Circulares Internas →
            </Link>
          </div>
        </div>
      </GestionModulesAccordion>
    </div>
  );
}