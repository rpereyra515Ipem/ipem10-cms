import { db } from '@/db';
import { posts } from '@/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PublicacionesListPage() {
  const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Miga de pan de navegación de retorno */}
      <nav className="mb-4">
        <Link
          href="/admin"
          className="text-xs text-emerald-800 hover:underline font-semibold inline-flex items-center gap-1"
        >
          ← Volver al Panel de Control Principal
        </Link>
      </nav>

      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Publicaciones del IPEM 10</h1>
          <p className="text-sm text-gray-600">Gestión de noticias, avisos y comunicados escolares</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/publicaciones/nueva"
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
          >
            + Nueva Publicación
          </Link>
        </div>
      </div>

      {allPosts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">Aún no hay publicaciones creadas.</p>
          <Link
            href="/admin/publicaciones/nueva"
            className="text-emerald-700 font-semibold hover:underline text-sm"
          >
            Crear la primera publicación escolar
          </Link>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Título</th>
                <th className="px-6 py-3 text-left font-semibold">Tipo</th>
                <th className="px-6 py-3 text-left font-semibold">Estado</th>
                <th className="px-6 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {post.title}
                    {post.isUrgent && (
                      <span className="ml-2 bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">
                        Urgente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs">{post.type}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        post.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {post.status === 'PUBLISHED' ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/noticias/${post.slug}`}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold text-xs"
                      target="_blank"
                    >
                      Ver en el sitio →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
