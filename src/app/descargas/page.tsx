import { db } from '@/db';
import { documents } from '@/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DescargasPublicPage({
  searchParams,
}: {
  searchParams: { cat?: string; anio?: string };
}) {
  const currentCat = searchParams.cat || 'TODOS';
  const currentAnio = searchParams.anio || 'TODOS';

  const allDocs = await db.select().from(documents).orderBy(desc(documents.createdAt));

  const filteredDocs = allDocs.filter((doc) => {
    const matchCat = currentCat === 'TODOS' || doc.category === currentCat;
    const matchAnio = currentAnio === 'TODOS' || doc.yearLevel === currentAnio;
    return matchCat && matchAnio;
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <nav className="mb-6">
        <Link href="/" className="text-emerald-800 hover:underline text-sm font-medium">
          ← Volver a la portada de la escuela
        </Link>
      </nav>

      <header className="text-center mb-8">
        <span className="text-xs uppercase font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
          Secretaría y Académico
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-2">
          Programas de Estudio y Descargas
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
          Acceso oficial a programas de materias para mesas de exámenes, formularios de secretaría y trámites del IPEM N° 10 Roma.
        </p>
      </header>

      {/* Pestañas de Categoría */}
      <div className="flex justify-center gap-2 mb-6 border-b pb-4 overflow-x-auto">
        {[
          { key: 'TODOS', label: 'Todos los Documentos' },
          { key: 'PROGRAMA', label: '📚 Programas de Materias' },
          { key: 'FORMULARIO', label: '📄 Formularios de Secretaría' },
          { key: 'NORMATIVA', label: '🏛️ Reglamentos y Normas' },
        ].map((tab) => (
          <Link
            key={tab.key}
            href={`/descargas?cat=${tab.key}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              currentCat === tab.key
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Cuadrícula de Documentos */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-gray-500 text-base">
            Aún no hay documentos cargados en esta categoría.
          </p>
          {currentCat !== 'TODOS' && (
            <Link href="/descargas" className="text-emerald-800 text-sm font-semibold hover:underline mt-2 inline-block">
              Ver todos los documentos
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-50 text-red-700 flex items-center justify-center rounded-lg font-black text-xs shrink-0 border border-red-100">
                  PDF
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base leading-snug">{doc.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-700">{doc.yearLevel}</span>
                    <span>•</span>
                    <span>{doc.fileSize}</span>
                  </div>
                </div>
              </div>

              <a
                href={doc.fileUrl}
                download
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold px-4 py-2 rounded-lg text-xs whitespace-nowrap transition shrink-0"
              >
                Descargar ↓
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
