import { db } from '@/db';
import { posts, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Generación dinámica de tarjeta para WhatsApp, Facebook y Twitter
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const result = await db
    .select({
      title: posts.title,
      excerpt: posts.excerpt,
      imageUrl: posts.imageUrl,
    })
    .from(posts)
    .where(eq(posts.slug, params.slug))
    .limit(1);

  const post = result[0];
  if (!post) {
    return { title: 'Publicación no encontrada - IPEM N° 10 Roma' };
  }

  const previewImage = post.imageUrl || '/escudo.png';

  return {
    title: `${post.title} | IPEM N° 10 Roma`,
    description: post.excerpt || 'Comunicado institucional oficial de la escuela IPEM N° 10 Roma, Alto Alberdi, Córdoba.',
    openGraph: {
      title: post.title,
      description: post.excerpt || 'Comunicado oficial del IPEM N° 10 Roma.',
      url: `https://ipem10.edu.ar/noticias/${params.slug}`,
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
    },
  };
}

export default async function DetalleNoticiaPage({
  params,
}: {
  params: { slug: string };
}) {
  const result = await db
    .select({
      title: posts.title,
      contentHtml: posts.contentHtml,
      imageUrl: posts.imageUrl,
      type: posts.type,
      isUrgent: posts.isUrgent,
      publishedAt: posts.publishedAt,
      authorName: users.fullName,
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.slug, params.slug))
    .limit(1);

  const post = result[0];
  if (!post) {
    notFound();
  }

  const author = post.authorName || 'Equipo Directivo IPEM 10';
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Fecha no disponible';

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <nav className="mb-6">
        <Link
          href="/"
          className="text-emerald-800 hover:underline text-sm font-semibold flex items-center gap-1"
        >
          ← Volver a la portada del IPEM 10
        </Link>
      </nav>

      <article className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        {post.isUrgent && (
          <span className="inline-block bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-full mb-4">
            Aviso Urgente
          </span>
        )}

        <div className="text-xs uppercase tracking-wider text-emerald-800 font-black mb-2">
          {post.type}
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>

        <div className="flex items-center text-sm text-gray-500 mb-8 border-b pb-4 gap-2">
          <span>Publicado el {formattedDate}</span>
          <span>•</span>
          <span>Por {author}</span>
        </div>

        {post.imageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden border bg-gray-50 max-h-96">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-emerald max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </main>
  );
}
