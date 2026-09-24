import { db } from '../src/db';
import { posts, users } from '../src/db/schema';
import { randomUUID } from 'crypto';
import he from 'he';

interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}

function cleanHtml(raw: string): string {
  if (!raw) return '';
  return he.decode(
    raw
      .replace(/\[\/?caption[^\]]*\]/g, '') // Elimina shortcodes de WordPress
      .replace(/<p>\s*<\/p>/g, '') // Elimina párrafos vacíos
      .trim()
  );
}

function cleanText(raw: string): string {
  if (!raw) return '';
  return he.decode(raw.replace(/<[^>]+>/g, '').trim());
}

async function migrar() {
  console.log('🔄 Conectando con https://ipem10.edu.ar/ ...');

  const defaultAuthorId = 'direccion-ipem10';

  // 1. Asegurar que exista el usuario institucional de Dirección
  try {
    await db
      .insert(users)
      .values({
        id: defaultAuthorId,
        email: 'direccion@ipem10.edu.ar',
        passwordHash: 'sin-acceso-local-migracion',
        fullName: 'Equipo Directivo IPEM 10',
        role: 'ADMIN',
      });
  } catch {
    // Si ya existe el usuario, continúa
  }

  // 2. Consultar la API pública de WordPress (las últimas 30 entradas con sus imágenes)
  const apiUrl = 'https://ipem10.edu.ar/wp-json/wp/v2/posts?per_page=30&_embed=true';

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) IPEM10-Migration-Tool',
      },
    });

    if (!res.ok) {
      throw new Error(`Error en el servidor de WordPress: ${res.status} ${res.statusText}`);
    }

    const wpPosts = (await res.json()) as WPPost[];
    console.log(`📥 Se encontraron ${wpPosts.length} publicaciones en el sitio actual.\n`);

    let count = 0;

    for (const item of wpPosts) {
      const title = cleanText(item.title.rendered) || 'Publicación sin título';
      const contentHtml = cleanHtml(item.content.rendered);
      const excerpt = cleanText(item.excerpt.rendered).slice(0, 200);
      const slug = (item.slug || `post-${Date.now()}`) + '-' + randomUUID().slice(0, 4);
      const publishedAt = new Date(item.date).toISOString();

      // Extraer foto destacada si existe
      let imageUrl: string | null = null;
      const media = item._embedded?.['wp:featuredmedia'];
      if (media && media.length > 0 && media[0].source_url) {
        imageUrl = media[0].source_url;
      }

      await db.insert(posts).values({
        id: randomUUID(),
        title,
        slug,
        excerpt,
        contentHtml,
        imageUrl,
        type: 'NOTICIA',
        status: 'PUBLISHED',
        isUrgent: false,
        userId: defaultAuthorId,
        publishedAt,
      });

      count++;
      console.log(`  ✓ [${count}/${wpPosts.length}] Importada: "${title}"`);
    }

    console.log(`\n🎉 ¡Migración finalizada con éxito! Se importaron ${count} noticias.`);
    console.log('👉 Ahora puedes recargar http://localhost:3000/ para ver las noticias en el portal.');
  } catch (error) {
    console.error('⚠️ Ocurrió un inconveniente al consultar la API de WordPress:', error);
  }
}

migrar();
