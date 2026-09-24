'use server';

import { db } from '@/db';
import { documents } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

export async function uploadDocumentAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error('No autorizado: Debe iniciar sesión para subir documentos.');
  }

  const title = formData.get('title') as string;
  const category = formData.get('category') as 'PROGRAMA' | 'FORMULARIO' | 'NORMATIVA';
  const yearLevel = (formData.get('yearLevel') as string) || 'TODOS';
  const file = formData.get('file') as File | null;

  if (!title || !file || file.size === 0) {
    throw new Error('El título y el archivo son obligatorios.');
  }

  // Límite de seguridad: 15 MB
  const maxBytes = 15 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error('El archivo excede el límite máximo permitido de 15 MB.');
  }

  // Validación de extensión segura
  const extension = path.extname(file.name).toLowerCase();
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
  if (!allowedExtensions.includes(extension)) {
    throw new Error('Tipo de archivo no permitido. Solo se aceptan PDFs, documentos de Word o imágenes.');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = `doc-${Date.now()}-${randomUUID().slice(0, 4)}${extension}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'docs');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  fs.writeFileSync(path.join(uploadDir, safeName), buffer);

  const sizeKb = Math.round(file.size / 1024);
  const formattedSize = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

  await db.insert(documents).values({
    id: randomUUID(),
    title,
    category: category || 'PROGRAMA',
    yearLevel,
    fileName: file.name,
    fileUrl: `/uploads/docs/${safeName}`,
    fileSize: formattedSize,
  });

  revalidatePath('/descargas');
  revalidatePath('/admin/descargas');
}

export async function deleteDocumentAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error('No autorizado: Debe iniciar sesión para eliminar documentos.');
  }

  const docId = formData.get('docId') as string;
  if (!docId) return;

  await db.delete(documents).where(eq(documents.id, docId));

  revalidatePath('/descargas');
  revalidatePath('/admin/descargas');
}
