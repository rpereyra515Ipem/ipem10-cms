import Link from "next/link";
import { createPostAction } from '@/actions/posts';

export default function NuevaPublicacionPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <nav className="mb-4"><Link href="/admin/publicaciones" className="text-xs text-emerald-800 hover:underline font-semibold">← Volver al listado de publicaciones</Link></nav><header className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Crear Nueva Publicación</h1>
        <p className="text-sm text-gray-600">IPEM 10 - Sistema de Gestión Escolar</p>
      </header>

      <form action={createPostAction} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
            Título
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="Ej: Muestra Anual de Ciencias y Tecnología"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-1">
              Tipo de contenido
            </label>
            <select
              id="type"
              name="type"
              className="w-full px-3 py-2 border rounded-md bg-white focus:outline-none"
            >
              <option value="NOTICIA">Noticia General</option>
              <option value="AVISO_URGENTE">Aviso Urgente</option>
              <option value="MESA_EXAMEN">Mesa de Examen</option>
              <option value="INSTITUCIONAL">Institucional</option>
            </select>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">
              Foto o imagen de portada
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="isUrgent"
            name="isUrgent"
            type="checkbox"
            className="h-4 w-4 text-blue-600 rounded border-gray-300"
          />
          <label htmlFor="isUrgent" className="text-sm font-medium text-gray-700">
            Marcar como aviso urgente (destacado en portada)
          </label>
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700 mb-1">
            Resumen breve
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            placeholder="Breve resumen visible en el listado y WhatsApp al compartir"
            className="w-full px-3 py-2 border rounded-md focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="contentHtml" className="block text-sm font-semibold text-gray-700 mb-1">
            Cuerpo de la publicación (HTML / Texto)
          </label>
          <textarea
            id="contentHtml"
            name="contentHtml"
            rows={10}
            required
            placeholder="Redacta la comunicación institucional aquí..."
            className="w-full px-3 py-2 border rounded-md font-mono text-sm focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="submit"
            name="status"
            value="PUBLISHED"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-md"
          >
            Publicar inmediatamente
          </button>
        </div>
      </form>
    </div>
  );
}
