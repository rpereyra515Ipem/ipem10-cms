'use server';

import { db } from '@/db';
import { posts } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
}

export async function createPostAction(formData: FormData): Promise<void> {
  const session = await getSession();
  const authorId = session ? session.userId : 'autor-inicial-ipem10';

  const title = formData.get('title') as string;
  const excerpt = formData.get('excerpt') as string;
  const contentHtml = formData.get('contentHtml') as string;
  const type = formData.get('type') as 'NOTICIA' | 'AVISO_URGENTE' | 'MESA_EXAMEN' | 'INSTITUCIONAL';
  const isUrgent = formData.get('isUrgent') === 'on';
  const status = formData.get('status') as 'DRAFT' | 'PUBLISHED';
  
  // Procesamiento de la imagen adjunta
  const imageFile = formData.get('image') as File | null;
  let imageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const extension = path.extname(imageFile.name) || '.jpg';
    const fileName = `img-${Date.now()}-${randomUUID().slice(0, 4)}${extension}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(path.join(uploadDir, fileName), buffer);
    imageUrl = `/uploads/${fileName}`;
  }

  if (!title || !contentHtml) {
    throw new Error('El título y el contenido son obligatorios.');
  }

  const slug = generateSlug(title);

  await db.insert(posts).values({
    id: randomUUID(),
    title,
    slug,
    excerpt,
    contentHtml,
    imageUrl,
    type: type || 'NOTICIA',
    status: status || 'PUBLISHED',
    isUrgent,
    userId: authorId,
    publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : null,
  });

  revalidatePath('/');
  revalidatePath('/noticias');
  redirect('/admin/publicaciones');
}
