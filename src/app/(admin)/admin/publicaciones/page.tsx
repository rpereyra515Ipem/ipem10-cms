import { db } from '@/db';
import { posts } from '@/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { deletePostAction } from '@/actions/posts';

export const dynamic = 'force-dynamic';

export default async function PublicacionesListPage() {
  const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Navegación de retorno */}
      <nav className="mb-4">
        <Link
          href="/admin"
          className="text-xs text-emerald-800 hover:text-emerald-950 font-bold inline-flex items-center gap-1.5 transition"
        >
          ← Volver al Panel de Control Principal
        </Link>
      </nav>

      {/* Encabezado y Estadísticas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-lg">📰</span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Gestión de Publicaciones
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Noticias oficiales, comunicados institucionales y avisos urgentes del IPEM N° 10 Roma
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
            <span>Total:</span>
            <span className="bg-white px-2 py-0.5 rounded-md shadow-xs border border-slate-200">{allPosts.length}</span>
          </div>

          <Link
            href="/admin/publicaciones/nueva"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
          >
            <span>+</span>
            <span>Nueva Publicación</span>
          </Link>
        </div>
      </div>

      {allPosts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-xs">
          <span className="text-4xl block mb-2">📭</span>
          <p className="text-gray-500 font-medium mb-4 text-sm">Aún no hay publicaciones creadas en el sistema.</p>
          <Link
            href="/admin/publicaciones/nueva"
            className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            Crear la primera publicación escolar
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-slate-50/80 text-gray-600 text-xs uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="px-5 py-3.5">Portada</th>
                  <th className="px-5 py-3.5">Título y Resumen</th>
                  <th className="px-4 py-3.5">Tipo</th>
                  <th className="px-4 py-3.5">Fecha</th>
                  <th className="px-4 py-3.5">Estado</th>
                  <th className="px-5 py-3.5 text-right">Acciones de Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {allPosts.map((post) => {
                  const fechaFormateada = post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                    : '—';

                  return (
                    <tr key={post.id} className="hover:bg-emerald-50/30 transition group">
                      {/* Portada / Miniatura */}
                      <td className="px-5 py-4 w-20">
                        {post.imageUrl ? (
                          <div className="w-14 h-11 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shadow-xs">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-11 rounded-lg bg-emerald-950 flex items-center justify-center text-[10px] text-emerald-300 font-black border border-emerald-800/40 shadow-xs">
                            IPEM 10
                          </div>
                        )}
                      </td>

                      {/* Título y Resumen */}
                      <td className="px-5 py-4 max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 group-hover:text-emerald-900 transition line-clamp-1">
                            {post.title}
                          </span>
                          {post.isUrgent && (
                            <span className="shrink-0 inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                              Urgente
                            </span>
                          )}
                        </div>
                        {post.excerpt && (
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 font-normal">
                            {post.excerpt}
                          </p>
                        )}
                      </td>

                      {/* Tipo de Publicación */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wide bg-slate-100 text-slate-700 border border-slate-200">
                          {post.type.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Fecha */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                        {fechaFormateada}
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${post.status === 'PUBLISHED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${post.status === 'PUBLISHED' ? 'bg-emerald-600' : 'bg-amber-600'
                              }`}
                          />
                          {post.status === 'PUBLISHED' ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botón Ver */}
                          <Link
                            href={`/noticias/${post.slug}`}
                            target="_blank"
                            title="Ver en el sitio web oficial"
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                          >
                            👁️
                          </Link>

                          {/* Botón Editar */}
                          <Link
                            href={`/admin/publicaciones/${post.id}/editar`}
                            title="Modificar noticia y fotografía"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold transition shadow-xs"
                          >
                            <span>✏️</span>
                            <span>Editar</span>
                          </Link>

                          {/* Botón Eliminar */}
                          <form action={deletePostAction}>
                            <input type="hidden" name="id" value={post.id} />
                            <button
                              type="submit"
                              title="Eliminar publicación"
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition text-xs font-bold"
                            >
                              🗑️
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}