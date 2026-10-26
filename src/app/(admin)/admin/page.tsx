import { db } from '@/db';
import { posts, exams, documents, memos, users, auditSecurityLogs, studentNotices } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { sql, and, gte, inArray, desc } from 'drizzle-orm';
import MaintenanceToggleClient from './MaintenanceToggleClient';
import AuditLogsTableClient from './AuditLogsTableClient';
import GestionModulesAccordion from './GestionModulesAccordion';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/acceso-institucional');
  }

  const isMaster = session.role === 'MASTER';
  const isSecretaria = session.role === 'SECRETARIA';
  const isPreceptor = session.role === 'PRECEPTOR';
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true';

  const [postsCount] = await db.select({ count: sql<number>`count(*)` }).from(posts);
  const [examsCount] = await db.select({ count: sql<number>`count(*)` }).from(exams);
  const [documentsCount] = await db.select({ count: sql<number>`count(*)` }).from(documents);
  const [memosCount] = await db.select({ count: sql<number>`count(*)` }).from(memos);
  const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(users);

  let pendingNoticesCount = 0;
  try {
    const [noticesRes] = await db.select({ count: sql<number>`count(*)` }).from(studentNotices);
    pendingNoticesCount = noticesRes?.count || 0;
  } catch {}

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
      {/* 1. CABECERA DIFERENCIADA POR ROL */}
      {isMaster ? (
        <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 border-2 border-amber-500/70 shadow-2xl rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  👑 ROL: MASTER / WEBMASTER
                </span>
                <span className="bg-purple-500/30 text-purple-200 border border-purple-400/40 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Control Total de Infraestructura
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Consola de Control Técnico & Auditoría
              </h1>
              <p className="text-purple-200/80 text-xs sm:text-sm mt-1">
                Sesión iniciada por: <strong className="text-amber-300 font-bold">{session.fullName}</strong>
              </p>
            </div>
            <Link
              href="/admin/usuarios"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow transition"
            >
              👥 Gestionar Personal y Roles
            </Link>
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
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Panel de Secretaría Docente y Gestión de Alumnos
              </h1>
              <p className="text-emerald-200/80 text-xs sm:text-sm mt-1">
                Bienvenido/a, <strong className="text-white font-bold">{session.fullName}</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/admin/secretaria/tramites"
                className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black text-xs px-4 py-2.5 rounded-xl shadow transition"
              >
                📋 Bandeja de Trámites
              </Link>
            </div>
          </div>
        </div>
      ) : isPreceptor ? (
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border-2 border-emerald-500/60 shadow-lg rounded-2xl p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-emerald-400 text-emerald-950 font-black text-xs px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  🧑‍🏫 ROL: PRECEPTORÍA Y VIDA ESCOLAR
                </span>
                <span className="text-xs bg-emerald-900/60 text-emerald-200 border border-emerald-700 px-2 py-0.5 rounded-full">
                  💻 Informática • 🤖 Robótica
                </span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Consola de Preceptoría y Citaciones a Familias
              </h1>
              <p className="text-emerald-200/80 text-xs sm:text-sm mt-1">
                Sesión activa: <strong className="text-white font-bold">{session.fullName}</strong>. Emisión de citaciones por WhatsApp/Email y avisos de curso.
              </p>
            </div>

            <Link
              href="/preceptoria"
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition inline-flex items-center gap-1.5 shrink-0"
            >
              <span>✉️</span> Abrir Cuaderno de Citaciones ➔
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border border-emerald-800 shadow-lg rounded-2xl p-6 text-white">
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
      )}

      {/* 2. INSPECCIÓN FORENSE (SOLO MASTER) */}
      {isMaster && (
        <div className="bg-slate-900 border border-purple-900/60 rounded-2xl p-6 shadow-xl text-white space-y-6">
          <MaintenanceToggleClient initialIsMaintenance={isMaintenance} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 block mb-1">Eventos Auditados (7 días)</span>
              <span className="text-3xl font-black text-purple-400">{auditTotal}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 block mb-1">Alertas Críticas</span>
              <span className="text-3xl font-black text-amber-400">{criticalTotal}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 block mb-1">Cuentas Registradas</span>
              <span className="text-3xl font-black text-emerald-400">{usersCount.count}</span>
            </div>
          </div>
          <AuditLogsTableClient initialLogs={recentAuditLogs} />
        </div>
      )}

      {/* 3. MÓDULOS DE GESTIÓN (SEGREGADOS POR ROL) */}
      <GestionModulesAccordion isMaster={isMaster}>
        {isPreceptor ? (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border-2 border-emerald-600/40 p-6 sm:p-8 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 mb-6">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                    Módulo Exclusivo de Preceptoría
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">
                    Cuaderno Digital de Citaciones y Comunicados Individuales
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Emite citaciones personalizadas por alumno, envía por WhatsApp o Email en 1 clic y verifica la firma digital de conformidad con DNI.
                  </p>
                </div>

                <Link
                  href="/preceptoria"
                  className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition inline-flex items-center gap-2 self-start sm:self-auto"
                >
                  <span>✉️</span>
                  <span>Ir a Citaciones y Horas Libres ➔</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/preceptoria"
                  className="p-5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 transition block group"
                >
                  <span className="text-2xl block mb-1.5">📲</span>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-900">
                    Citaciones por WhatsApp y Email
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Enviar cédulas individuales a padres y tutores con acuse de recibo.
                  </p>
                </Link>

                <Link
                  href="/preceptoria"
                  className="p-5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 transition block group"
                >
                  <span className="text-2xl block mb-1.5">🚨</span>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-900">
                    Avisos de Horas Libres
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Publicar ingresos tardíos o retiros anticipados por curso y división.
                  </p>
                </Link>

                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                  <span className="text-2xl block mb-1.5">📊</span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Cédulas Emitidas
                  </h4>
                  <p className="text-2xl font-black text-emerald-900 mt-1">
                    {pendingNoticesCount} <span className="text-xs font-normal text-slate-500">registradas</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border-2 border-emerald-600/40 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">🧑‍🏫</span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Cursos & Familias
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">Preceptoría y Citaciones</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                    Emisión de cédulas individuales por WhatsApp y Email, y avisos de horas libres.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <Link href="/preceptoria" className="text-xs font-bold px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm transition">
                    ✉️ Citaciones y Avisos
                  </Link>
                  <Link href="/preceptoria" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 ml-auto">
                    Abrir ➔
                  </Link>
                </div>
              </div>

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
                    Altas individuales, carga masiva y enlace oficial a CiDi para trámites de MAB.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                  <Link href="/admin/usuarios" className="text-xs font-bold px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm">
                    ➕ Alta Docente
                  </Link>
                  <Link href="/secretaria/carga-masiva" className="text-xs font-bold px-3 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 rounded-lg shadow-sm">
                    📥 Carga Masiva
                  </Link>
                  <a href="https://cidi.cba.gov.ar" target="_blank" rel="noopener noreferrer" className="text-xs font-bold px-3 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg shadow-sm">
                    🏛️ CiDi (MAB) ↗
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="text-2xl mb-2">📢</div>
                  <h3 className="font-bold text-gray-900 text-base">Noticias y Comunicados</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                    Avisos urgentes de portada y novedades para la comunidad educativa.
                  </p>
                </div>
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <Link href="/admin/publicaciones" className="text-xs font-bold px-3 py-2 border rounded-lg hover:bg-gray-50 text-gray-700">
                    Ver Listado
                  </Link>
                  <Link href="/admin/publicaciones/nueva" className="text-xs font-bold px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow">
                    + Nueva Noticia
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="text-2xl mb-2">📅</div>
                  <h3 className="font-bold text-gray-900 text-base">Cronograma de Mesas</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                    Fechas, horarios, turnos, aulas y tribunales de previas.
                  </p>
                </div>
                <Link href="/admin/mesas" className="text-xs font-bold px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow inline-block text-center">
                  Gestionar Mesas →
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="text-2xl mb-2">📁</div>
                  <h3 className="font-bold text-gray-900 text-base">Programas y Descargas</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                    PDFs de programas de 1° a 6° año y formularios para familias.
                  </p>
                </div>
                <Link href="/admin/descargas" className="text-xs font-bold px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow inline-block text-center">
                  Gestionar PDFs →
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="text-2xl mb-2">📋</div>
                  <h3 className="font-bold text-gray-900 text-base">Circulares Internas</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                    Memos confidenciales para docentes y preceptores.
                  </p>
                </div>
                <Link href="/admin/circulares" className="text-xs font-bold px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg shadow inline-block text-center">
                  Gestionar Circulares →
                </Link>
              </div>
            </div>
          </>
        )}
      </GestionModulesAccordion>
    </div>
  );
}
