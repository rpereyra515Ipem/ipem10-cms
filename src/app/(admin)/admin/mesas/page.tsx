import { db } from '@/db';
import { exams } from '@/db/schema';
import { createExamAction, deleteExamAction } from '@/actions/exams';
import { desc } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminMesasPage() {
  const allExams = await db.select().from(exams).orderBy(desc(exams.examDate));

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Mesas de Examen</h1>
          <p className="text-sm text-gray-600">IPEM N° 10 Roma • Carga y actualización de cronogramas</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/mesas"
            target="_blank"
            className="text-sm text-blue-700 font-semibold px-4 py-2 border rounded-md hover:bg-gray-50 transition"
          >
            Ver vista pública →
          </Link>
          <Link
            href="/admin/publicaciones"
            className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Volver a Publicaciones
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de Carga */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Cargar Nueva Mesa</h2>
          <form action={createExamAction} className="space-y-4 text-sm">
            <div>
              <label htmlFor="subject" className="block font-medium text-gray-700 mb-1">Materia</label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                placeholder="Ej: Matemática"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="yearLevel" className="block font-medium text-gray-700 mb-1">Año</label>
                <select id="yearLevel" name="yearLevel" className="w-full px-3 py-2 border rounded-md bg-white">
                  <option value="1° Año">1° Año</option>
                  <option value="2° Año">2° Año</option>
                  <option value="3° Año">3° Año</option>
                  <option value="4° Año">4° Año</option>
                  <option value="5° Año">5° Año</option>
                  <option value="6° Año">6° Año</option>
                </select>
              </div>

              <div>
                <label htmlFor="shift" className="block font-medium text-gray-700 mb-1">Turno</label>
                <select id="shift" name="shift" className="w-full px-3 py-2 border rounded-md bg-white">
                  <option value="MAÑANA">Mañana</option>
                  <option value="TARDE">Tarde</option>
                  <option value="AMBOS">Ambos Turnos</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="callName" className="block font-medium text-gray-700 mb-1">Turno / Convocatoria</label>
              <input
                id="callName"
                name="callName"
                type="text"
                required
                defaultValue="Turno Extraordinario Octubre 2026"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="examDate" className="block font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  id="examDate"
                  name="examDate"
                  type="date"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="examTime" className="block font-medium text-gray-700 mb-1">Horario</label>
                <input
                  id="examTime"
                  name="examTime"
                  type="text"
                  required
                  placeholder="Ej: 08:30 hs"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="teachers" className="block font-medium text-gray-700 mb-1">Tribunal Docente</label>
              <input
                id="teachers"
                name="teachers"
                type="text"
                required
                placeholder="Ej: Prof. Gómez, Prof. Pereyra"
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="classroom" className="block font-medium text-gray-700 mb-1">Aula / Espacio</label>
              <input
                id="classroom"
                name="classroom"
                type="text"
                placeholder="Ej: Aula 3 / Biblioteca"
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 rounded-md transition mt-2"
            >
              Guardar Mesa de Examen
            </button>
          </form>
        </div>

        {/* Listado de Mesas Registradas */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Mesas Cargadas ({allExams.length})</h3>
            </div>

            {allExams.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay mesas de examen cargadas todavía. Usa el formulario de la izquierda para agregar la primera.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Materia y Año</th>
                      <th className="px-4 py-3 text-left font-semibold">Fecha / Hora</th>
                      <th className="px-4 py-3 text-left font-semibold">Tribunal</th>
                      <th className="px-4 py-3 text-right font-semibold">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {allExams.map((exam) => (
                      <tr key={exam.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-bold text-gray-900">{exam.subject}</p>
                          <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-medium">
                            {exam.yearLevel} • Turno {exam.shift}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-800">{exam.examDate}</p>
                          <span className="text-xs text-gray-500">{exam.examTime} • {exam.classroom}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs">
                          {exam.teachers}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <form action={deleteExamAction}>
                            <input type="hidden" name="examId" value={exam.id} />
                            <button
                              type="submit"
                              className="text-xs text-red-600 hover:text-red-900 font-semibold"
                            >
                              Eliminar
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
