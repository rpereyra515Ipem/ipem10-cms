import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { db } from '@/db';
import { users, posts, exams, documents, memos, auditSecurityLogs } from '@/db/schema';
import { hashPassword } from '@/lib/password';
import { randomUUID } from 'crypto';
import { eq, sql } from 'drizzle-orm';
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
      .replace(/\[\/?caption[^\]]*\]/g, '')
      .replace(/<p>\s*<\/p>/g, '')
      .trim()
  );
}

function cleanText(raw: string): string {
  if (!raw) return '';
  return he.decode(raw.replace(/<[^>]+>/g, '').trim());
}

async function runSetup() {
  console.log('\n🚀 [INICIALIZACIÓN DE BASE DE DATOS IPEM 10]');
  console.log('--------------------------------------------------');

  // 1. Crear tablas si no existen
  const createTablesSql = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'DOCENTE',
      must_change_password INTEGER NOT NULL DEFAULT 1,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT,
      content_html TEXT NOT NULL,
      image_url TEXT,
      type TEXT NOT NULL DEFAULT 'NOTICIA',
      status TEXT NOT NULL DEFAULT 'DRAFT',
      is_urgent INTEGER NOT NULL DEFAULT 0,
      user_id TEXT NOT NULL,
      published_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS exams (
      id TEXT PRIMARY KEY,
      subject TEXT NOT NULL,
      year_level TEXT NOT NULL,
      shift TEXT NOT NULL DEFAULT 'MAÑANA',
      call_name TEXT NOT NULL,
      exam_date TEXT NOT NULL,
      exam_time TEXT NOT NULL,
      teachers TEXT NOT NULL,
      classroom TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      year_level TEXT NOT NULL DEFAULT 'TODOS',
      file_name TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_size TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS memos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      sender TEXT NOT NULL DEFAULT 'Dirección / Vicedirección',
      priority TEXT NOT NULL DEFAULT 'NORMAL',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_security_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
      severity TEXT NOT NULL,
      action TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      actor_id TEXT,
      actor_role TEXT,
      target_resource TEXT,
      ip_address TEXT,
      user_agent TEXT,
      details TEXT
    );
  `;

  // Ejecución directa de creación de tablas
  const statements = createTablesSql.split(';').map(s => s.trim()).filter(Boolean);
  for (const statement of statements) {
    await db.run(sql.raw(statement));
  }
  console.log('✅ Tablas de sistema verificadas y creadas.');

  // 2. Crear usuario MASTER (Lic. Rafael Pereyra)
  const masterEmail = 'rpereyra.ipem10@gmail.com';
  const existingMaster = await db.select().from(users).where(eq(users.email, masterEmail)).limit(1);
  if (existingMaster.length === 0) {
    const masterHash = await hashPassword('MasterIPEM10Seguro!');
    await db.insert(users).values({
      id: randomUUID(),
      email: masterEmail,
      passwordHash: masterHash,
      fullName: 'Lic. Rafael Pereyra (Webmaster Master)',
      role: 'MASTER',
      mustChangePassword: false,
      active: true,
    });
    console.log(`👑 Usuario MASTER creado: ${masterEmail}`);
  }

  // 3. Crear usuario DIRECTIVO (Vicedirección)
  const directivoEmail = 'vicedireccion@ipem10.edu.ar';
  const existingDirectivo = await db.select().from(users).where(eq(users.email, directivoEmail)).limit(1);
  if (existingDirectivo.length === 0) {
    const directivoHash = await hashPassword('ClaveTemporal123!');
    await db.insert(users).values({
      id: randomUUID(),
      email: directivoEmail,
      passwordHash: directivoHash,
      fullName: 'Prof. Vicedirección IPEM 10',
      role: 'DIRECTIVO',
      mustChangePassword: true,
      active: true,
    });
    console.log(`👤 Usuario DIRECTIVO creado: ${directivoEmail}`);
  }

  // 4. Migrar noticias de WordPress si la tabla posts está vacía
  const existingPosts = await db.select().from(posts).limit(1);
  if (existingPosts.length === 0) {
    console.log('🔄 Descargando publicaciones oficiales de https://ipem10.edu.ar/ ...');
    try {
      const res = await fetch('https://ipem10.edu.ar/wp-json/wp/v2/posts?per_page=30&_embed=true', {
        headers: { 'User-Agent': 'IPEM10-Setup-Tool' },
      });

      if (res.ok) {
        const wpPosts: WPPost[] = await res.json();
        for (const wp of wpPosts) {
          const title = cleanText(wp.title.rendered);
          const content = cleanHtml(wp.content.rendered);
          const excerpt = cleanText(wp.excerpt.rendered);
          const imageUrl = wp._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

          await db.insert(posts).values({
            id: randomUUID(),
            title,
            slug: wp.slug || `post-${wp.id}`,
            excerpt,
            contentHtml: content,
            imageUrl,
            type: 'NOTICIA',
            status: 'PUBLISHED',
            isUrgent: false,
            userId: 'direccion-ipem10',
            publishedAt: wp.date,
          });
        }
        console.log(`📰 Se cargaron ${wpPosts.length} noticias exitosamente.`);
      }
    } catch (wpError) {
      console.warn('Nota sobre noticias:', wpError);
    }
  } else {
    console.log('📰 Las noticias ya existen en la base de datos.');
  }

  console.log('--------------------------------------------------\n');
}

runSetup().then(() => process.exit(0)).catch((e) => {
  console.error('Error en setup:', e);
  process.exit(1);
});
