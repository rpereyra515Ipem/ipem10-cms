import { db } from '@/db';
import { documents } from '@/db/schema';
import { uploadDocumentAction, deleteDocumentAction } from '@/actions/documents';
import { desc } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDescargasPage() {
  const allDocs = await db.select().from(documents).orderBy(desc(documents.createdAt));

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Descargas y Programas</h1>
          <p className="text-sm text-gray-600">IPEM N° 10 Roma • Carga de PDFs y formularios escolares</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/descargas"
            target="_blank"
            className="text-sm text-blue-700 font-semibold px-4 py-2 border rounded-md hover:bg-gray-50 transition"
          >
            Ver repositorio público →
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
        {/* Formulario de Subida */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Subir Nuevo Documento</h2>
          <form action={uploadDocumentAction} className="space-y-4 text-sm">
            <div>
              <label htmlFor="title" className="block font-medium text-gray-700 mb-1">Título del documento</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="Ej: Programa de Matemática 3° Año 2026"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="category" className="block font-medium text-gray-700 mb-1">Categoría</label>
              <select id="category" name="category" className="w-full px-3 py-2 border rounded-md bg-white">
                <option value="PROGRAMA">Programa de Estudio</option>
                <option value="FORMULARIO">Formulario de Secretaría / Trámite</option>
                <option value="NORMATIVA">Reglamento / Normativa Institucional</option>
              </select>
            </div>

            <div>
              <label htmlFor="yearLevel" className="block font-medium text-gray-700 mb-1">Año correspondiente</label>
              <select id="yearLevel" name="yearLevel" className="w-full px-3 py-2 border rounded-md bg-white">
                <option value="TODOS">Todos los años / General</option>
                <option value="1° Año">1° Año</option>
                <option value="2° Año">2° Año</option>
                <option value="3° Año">3° Año</option>
                <option value="4° Año">4° Año</option>
                <option value="5° Año">5° Año</option>
                <option value="6° Año">6° Año</option>
              </select>
            </div>

            <div>
              <label htmlFor="file" className="block font-medium text-gray-700 mb-1">Archivo (PDF, Word o Imagen)</label>
              <input
                id="file"
                name="file"
                type="file"
                required
                accept=".pdf,.doc,.docx,.jpg,.png"
                className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 rounded-md transition mt-2"
            >
              Subir y Publicar Documento
            </button>
          </form>
        </div>

        {/* Listado de Documentos */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h3 className="font-bold text-gray-800">Documentos Disponibles ({allDocs.length})</h3>
            </div>

            {allDocs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay documentos subidos todavía. Sube el primer programa o formulario con el formulario de la izquierda.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Documento</th>
                      <th className="px-4 py-3 text-left font-semibold">Tipo</th>
                      <th className="px-4 py-3 text-left font-semibold">Peso</th>
                      <th className="px-4 py-3 text-right font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {allDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-bold text-gray-900">{doc.title}</p>
                          <span className="text-xs text-gray-500">{doc.yearLevel}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                            {doc.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{doc.fileSize}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline font-semibold"
                          >
                            Ver / Descargar
                          </a>
                          <form action={deleteDocumentAction} className="inline">
                            <input type="hidden" name="docId" value={doc.id} />
                            <button
                              type="submit"
                              className="text-xs text-red-600 hover:text-red-800 font-semibold ml-2"
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
