'use server';

import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';
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
  revalidatePath('/admin/publicaciones');
  redirect('/admin/publicaciones');
}

export async function updatePostAction(formData: FormData): Promise<void> {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const excerpt = formData.get('excerpt') as string;
  const contentHtml = formData.get('contentHtml') as string;
  const type = formData.get('type') as 'NOTICIA' | 'AVISO_URGENTE' | 'MESA_EXAMEN' | 'INSTITUCIONAL';
  const isUrgent = formData.get('isUrgent') === 'on';
  const status = formData.get('status') as 'DRAFT' | 'PUBLISHED';
  const currentImageUrl = formData.get('currentImageUrl') as string;

  if (!id || !title || !contentHtml) {
    throw new Error('Faltan campos obligatorios para actualizar la publicación.');
  }

  // Si subió un nuevo archivo de imagen, lo procesamos; si no, conservamos la que ya tenía
  const imageFile = formData.get('image') as File | null;
  let imageUrl = currentImageUrl || null;

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

  await db.update(posts).set({
    title,
    excerpt,
    contentHtml,
    imageUrl,
    type: type || 'NOTICIA',
    status: status || 'PUBLISHED',
    isUrgent,
  }).where(eq(posts.id, id));

  revalidatePath('/');
  revalidatePath('/noticias');
  revalidatePath('/admin/publicaciones');
  redirect('/admin/publicaciones');
}

export async function deletePostAction(formData: FormData): Promise<void> {
  const id = formData.get('id') as string;
  if (!id) return;

  await db.delete(posts).where(eq(posts.id, id));

  revalidatePath('/');
  revalidatePath('/noticias');
  revalidatePath('/admin/publicaciones');
  redirect('/admin/publicaciones');
}