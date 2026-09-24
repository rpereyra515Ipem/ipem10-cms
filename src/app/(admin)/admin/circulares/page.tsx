import { db } from '@/db';
import { memos } from '@/db/schema';
import { createMemoAction, deleteMemoAction } from '@/actions/memos';
import { desc } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminCircularesPage() {
  const allMemos = await db.select().from(memos).orderBy(desc(memos.createdAt));

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Circulares Internas Docentes</h1>
          <p className="text-sm text-gray-600">IPEM N° 10 Roma • Comunicados exclusivos de Sala de Profesores</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/docentes"
            target="_blank"
            className="text-sm text-blue-700 font-semibold px-4 py-2 border rounded-md hover:bg-gray-50 transition"
          >
            Ver Sala de Profesores →
          </Link>
          <Link
            href="/admin/publicaciones"
            className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Panel Principal
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Emitir Circular Interna</h2>
          <form action={createMemoAction} className="space-y-4 text-sm">
            <div>
              <label htmlFor="title" className="block font-medium text-gray-700 mb-1">Título de la circular</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="Ej: Plazo de entrega de planillas 2° Trimestre"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="sender" className="block font-medium text-gray-700 mb-1">Emisor</label>
              <select id="sender" name="sender" className="w-full px-3 py-2 border rounded-md bg-white">
                <option value="Vicedirección">Vicedirección</option>
                <option value="Dirección">Dirección</option>
                <option value="Secretaría">Secretaría</option>
                <option value="Coordinación Pedagógica">Coordinación Pedagógica</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="priority"
                name="priority"
                type="checkbox"
                value="URGENTE"
                className="h-4 w-4 text-red-600 rounded border-gray-300"
              />
              <label htmlFor="priority" className="text-xs font-semibold text-gray-700">
                Marcar como prioridad urgente / lectura obligatoria
              </label>
            </div>

            <div>
              <label htmlFor="content" className="block font-medium text-gray-700 mb-1">Texto de la circular</label>
              <textarea
                id="content"
                name="content"
                rows={6}
                required
                placeholder="Detalle las pautas, fechas de entrega o resoluciones para el personal docente..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 rounded-md transition"
            >
              Emitir Circular a Docentes
            </button>
          </form>
        </div>

        {/* Listado */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-gray-800 text-lg">Circulares Emitidas ({allMemos.length})</h3>
          {allMemos.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border text-center text-gray-500">
              No hay circulares emitidas aún.
            </div>
          ) : (
            allMemos.map((memo) => (
              <div key={memo.id} className="bg-white border rounded-xl p-5 shadow-sm space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    {memo.priority === 'URGENTE' && (
                      <span className="bg-red-100 text-red-700 font-bold text-xs px-2 py-0.5 rounded-full mr-2">
                        Urgente
                      </span>
                    )}
                    <span className="text-xs text-blue-700 font-semibold">{memo.sender}</span>
                    <h4 className="font-bold text-gray-900 text-base mt-1">{memo.title}</h4>
                  </div>
                  <form action={deleteMemoAction}>
                    <input type="hidden" name="memoId" value={memo.id} />
                    <button type="submit" className="text-xs text-red-600 hover:underline font-semibold">
                      Eliminar
                    </button>
                  </form>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{memo.content}</p>
                <p className="text-xs text-gray-400 pt-2 border-t">{memo.createdAt}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
