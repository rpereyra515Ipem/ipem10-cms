import { db } from '@/db';
import { exams } from '@/db/schema';
import { asc } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MesasPublicPage({
  searchParams,
}: {
  searchParams: { q?: string; anio?: string };
}) {
  const query = searchParams.q?.toLowerCase() || '';
  const anio = searchParams.anio || 'TODOS';

  const allExams = await db.select().from(exams).orderBy(asc(exams.examDate));

  // Filtrado en memoria
  const filteredExams = allExams.filter((exam) => {
    const matchesQuery =
      !query ||
      exam.subject.toLowerCase().includes(query) ||
      exam.teachers.toLowerCase().includes(query);
    const matchesYear = anio === 'TODOS' || exam.yearLevel === anio;
    return matchesQuery && matchesYear;
  });

  const anios = ['TODOS', '1° Año', '2° Año', '3° Año', '4° Año', '5° Año', '6° Año'];

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <nav className="mb-6">
        <Link href="/" className="text-emerald-800 hover:underline text-sm font-medium">
          ← Volver a la portada de la escuela
        </Link>
      </nav>

      <header className="text-center mb-8">
        <span className="text-xs uppercase font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
          Cronograma Oficial
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-2">
          Mesas de Exámenes
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
          Consulta fechas, horarios y tribunales para materias previas, libres y equivalencias del IPEM N° 10 Roma.
        </p>
      </header>

      {/* Buscador y Filtros */}
      <div className="bg-white p-4 rounded-xl border shadow-sm mb-8 space-y-4">
        <form method="GET" className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="q"
            defaultValue={searchParams.q || ''}
            placeholder="Buscar por materia (ej: Matemática, Biología)..."
            className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-5 py-2 rounded-lg text-sm transition"
          >
            Buscar
          </button>
        </form>

        {/* Filtros por año */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="font-semibold text-gray-500 mr-1">Filtrar por año:</span>
          {anios.map((item) => (
            <Link
              key={item}
              href={`/mesas?anio=${encodeURIComponent(item)}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition ${
                anio === item
                  ? 'bg-emerald-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>

      {/* Resultados de Mesas */}
      {filteredExams.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-gray-500 text-base">
            No se encontraron mesas de examen que coincidan con la búsqueda.
          </p>
          {(query || anio !== 'TODOS') && (
            <Link href="/mesas" className="text-emerald-800 text-sm font-semibold hover:underline mt-2 inline-block">
              Limpiar filtros
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    {exam.yearLevel} • Turno {exam.shift}
                  </span>
                  <span className="text-xs text-gray-500">{exam.classroom || 'Aula a confirmar'}</span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-1">{exam.subject}</h2>
                <p className="text-xs text-gray-500 mb-4">{exam.callName}</p>
              </div>

              <div className="border-t pt-3 space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">📅 Fecha:</span>
                  <span className="font-bold text-emerald-950">{exam.examDate} a las {exam.examTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">👥 Tribunal:</span>
                  <span>{exam.teachers}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Consejos para el examen */}
      <footer className="mt-12 p-5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1.5">
        <p className="font-bold text-sm text-amber-950">Recordatorios importantes para el estudiante:</p>
        <p>• Presentarse 15 minutos antes con uniforme escolar o vestimenta adecuada y Documento Nacional de Identidad (DNI).</p>
        <p>• Asistir con el programa de la materia impreso o en formato digital y los útiles necesarios.</p>
      </footer>
    </main>
  );
}
