import { db } from '@/db';
import { posts, exams, documents, memos } from '@/db/schema';
import { sql } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Consultas rápidas para contar registros en la base de datos
  const [postsCount] = await db.select({ count: sql<number>`count(*)` }).from(posts);
  const [examsCount] = await db.select({ count: sql<number>`count(*)` }).from(exams);
  const [docsCount] = await db.select({ count: sql<number>`count(*)` }).from(documents);
  const [memosCount] = await db.select({ count: sql<number>`count(*)` }).from(memos);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Encabezado del Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b pb-4 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
            Panel de Control
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
            Administración IPEM N° 10 Roma
          </h1>
          <p className="text-sm text-gray-600">
            Gestión centralizada de contenidos, exámenes, documentos y circulares docentes.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition flex items-center gap-1.5"
        >
          <span>🌐</span> Ver Sitio Web Público →
        </Link>
      </div>

      {/* Tarjetas de Métricas en Tiempo Real */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Publicaciones</p>
          <p className="text-3xl font-black text-blue-700 mt-1">{postsCount?.count || 0}</p>
          <span className="text-xs text-gray-400">Noticias y avisos</span>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mesas de Examen</p>
          <p className="text-3xl font-black text-amber-600 mt-1">{examsCount?.count || 0}</p>
          <span className="text-xs text-gray-400">Materias en cronograma</span>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Documentos y PDFs</p>
          <p className="text-3xl font-black text-green-700 mt-1">{docsCount?.count || 0}</p>
          <span className="text-xs text-gray-400">Programas y formularios</span>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Circulares Docentes</p>
          <p className="text-3xl font-black text-purple-700 mt-1">{memosCount?.count || 0}</p>
          <span className="text-xs text-gray-400">Sala de profesores</span>
        </div>
      </section>

      {/* Módulos de Gestión */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Módulos de Gestión</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Módulo 1: Publicaciones */}
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📢</span>
              <h3 className="text-lg font-bold text-gray-900">Noticias y Comunicados Públicos</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Crea avisos urgentes para la portada, comunicados generales con imágenes y novedades para la comunidad educativa.
            </p>
          </div>
          <div className="flex gap-2 border-t pt-4">
            <Link
              href="/admin/publicaciones"
              className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold py-2 rounded-lg transition"
            >
              Ver Listado
            </Link>
            <Link
              href="/admin/publicaciones/nueva"
              className="flex-1 text-center bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold py-2 rounded-lg transition"
            >
              + Nueva Noticia
            </Link>
          </div>
        </div>

        {/* Módulo 2: Mesas de Examen */}
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📅</span>
              <h3 className="text-lg font-bold text-gray-900">Cronograma de Mesas de Examen</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Administra las fechas, horarios, turnos, aulas y tribunales de materias previas, libres y equivalencias.
            </p>
          </div>
          <div className="border-t pt-4">
            <Link
              href="/admin/mesas"
              className="block text-center bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-2 rounded-lg transition"
            >
              Gestionar Mesas de Examen →
            </Link>
          </div>
        </div>

        {/* Módulo 3: Descargas y Programas */}
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📁</span>
              <h3 className="text-lg font-bold text-gray-900">Programas de Estudio y Secretaría</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Sube y actualiza los PDFs de los programas de 1° a 6° año y los formularios descargables para familias.
            </p>
          </div>
          <div className="border-t pt-4">
            <Link
              href="/admin/descargas"
              className="block text-center bg-green-700 hover:bg-green-800 text-white text-xs font-semibold py-2 rounded-lg transition"
            >
              Gestionar Repositorio de PDFs →
            </Link>
          </div>
        </div>

        {/* Módulo 4: Circulares Docentes */}
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📋</span>
              <h3 className="text-lg font-bold text-gray-900">Circulares Internas Docentes</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Emite comunicados exclusivos para directivos, docentes y preceptores en la Sala de Profesores Digital.
            </p>
          </div>
          <div className="border-t pt-4">
            <Link
              href="/admin/circulares"
              className="block text-center bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold py-2 rounded-lg transition"
            >
              Gestionar Circulares Internas →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
