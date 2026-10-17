import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { updatePostAction } from '@/actions/posts';

interface EditarPublicacionProps {
    params: {
        id: string;
    };
}

export default async function EditarPublicacionPage({ params }: EditarPublicacionProps) {
    const { id } = params;

    const [post] = await db.select().from(posts).where(eq(posts.id, id));

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
            {/* Miga de pan */}
            <nav className="mb-4">
                <Link
                    href="/admin/publicaciones"
                    className="text-xs text-emerald-800 hover:text-emerald-950 font-bold inline-flex items-center gap-1.5 transition"
                >
                    ← Volver al listado de publicaciones
                </Link>
            </nav>

            {/* Encabezado */}
            <header className="mb-6 border-b border-gray-200 pb-4">
                <span className="text-[10px] font-black tracking-wider uppercase bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Edición de Contenido
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1.5">
                    Modificar Publicación
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                    IPEM N° 10 Roma • Actualización en tiempo real
                </p>
            </header>

            {/* Formulario de Edición */}
            <form action={updatePostAction} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
                {/* Identificadores Ocultos */}
                <input type="hidden" name="id" value={post.id} />
                <input type="hidden" name="currentImageUrl" value={post.imageUrl || ''} />

                {/* Título */}
                <div>
                    <label htmlFor="title" className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Título de la Publicación
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        defaultValue={post.title}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none transition font-medium"
                    />
                </div>

                {/* Selector de Tipo y Estado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="type" className="block text-xs font-bold uppercase text-gray-700 mb-1">
                            Tipo de contenido
                        </label>
                        <select
                            id="type"
                            name="type"
                            defaultValue={post.type}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none transition font-medium"
                        >
                            <option value="NOTICIA">Noticia General</option>
                            <option value="AVISO_URGENTE">Aviso Urgente</option>
                            <option value="MESA_EXAMEN">Mesa de Examen</option>
                            <option value="INSTITUCIONAL">Institucional</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-xs font-bold uppercase text-gray-700 mb-1">
                            Estado de Publicación
                        </label>
                        <select
                            id="status"
                            name="status"
                            defaultValue={post.status}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none transition font-medium"
                        >
                            <option value="PUBLISHED">Publicado (Visible en el sitio)</option>
                            <option value="DRAFT">Borrador (Oculto)</option>
                        </select>
                    </div>
                </div>

                {/* Fotografía de Portada con Vista Previa */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold uppercase text-gray-700">
                        Fotografía de Portada
                    </label>

                    {post.imageUrl && (
                        <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-200">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-24 h-16 object-cover rounded-lg border border-gray-200 shadow-xs"
                            />
                            <div className="text-xs">
                                <p className="font-bold text-gray-800">Fotografía actual cargada</p>
                                <p className="text-gray-500 font-mono text-[11px] truncate max-w-xs">{post.imageUrl}</p>
                                <p className="text-[11px] text-emerald-700 mt-0.5">
                                    Si no seleccionás ningún archivo nuevo, se mantendrá esta fotografía.
                                </p>
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="image" className="block text-xs font-medium text-gray-600 mb-1">
                            {post.imageUrl ? 'Reemplazar con una nueva fotografía:' : 'Cargar fotografía de portada:'}
                        </label>
                        <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition cursor-pointer"
                        />
                    </div>
                </div>

                {/* Aviso Urgente Checkbox */}
                <div className="flex items-center gap-2.5 p-3 bg-rose-50/60 rounded-xl border border-rose-200/60">
                    <input
                        id="isUrgent"
                        name="isUrgent"
                        type="checkbox"
                        defaultChecked={Boolean(post.isUrgent)}
                        className="h-4 w-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500 cursor-pointer"
                    />
                    <label htmlFor="isUrgent" className="text-xs font-bold text-rose-900 cursor-pointer">
                        Marcar como aviso urgente (destacado prioritario en portada)
                    </label>
                </div>

                {/* Resumen Breve */}
                <div>
                    <label htmlFor="excerpt" className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Resumen Breve (Copete)
                    </label>
                    <textarea
                        id="excerpt"
                        name="excerpt"
                        rows={2}
                        defaultValue={post.excerpt || ''}
                        placeholder="Breve resumen visible en el listado y WhatsApp al compartir..."
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none transition"
                    />
                </div>

                {/* Cuerpo Completo */}
                <div>
                    <label htmlFor="contentHtml" className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Cuerpo de la Publicación (Texto / HTML)
                    </label>
                    <textarea
                        id="contentHtml"
                        name="contentHtml"
                        rows={10}
                        required
                        defaultValue={post.contentHtml}
                        placeholder="Redacta la comunicación institucional aquí..."
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-sans focus:ring-2 focus:ring-emerald-600 focus:outline-none transition"
                    />
                </div>

                {/* Botones de Guardar / Cancelar */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                    <Link
                        href="/admin/publicaciones"
                        className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 transition"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
}