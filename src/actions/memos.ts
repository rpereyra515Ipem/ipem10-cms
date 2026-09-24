'use server';

import { db } from '@/db';
import { memos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

export async function createMemoAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error('No autorizado: Debe iniciar sesión para emitir circulares.');
  }

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const sender = (formData.get('sender') as string) || 'Vicedirección IPEM 10';
  const priority = (formData.get('priority') as 'NORMAL' | 'URGENTE') || 'NORMAL';

  if (!title || !content) {
    throw new Error('El título y el contenido son obligatorios.');
  }

  await db.insert(memos).values({
    id: randomUUID(),
    title,
    content,
    sender,
    priority,
  });

  revalidatePath('/docentes');
  revalidatePath('/admin/circulares');
}

export async function deleteMemoAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error('No autorizado: Debe iniciar sesión para eliminar circulares.');
  }

  const memoId = formData.get('memoId') as string;
  if (!memoId) return;

  await db.delete(memos).where(eq(memos.id, memoId));

  revalidatePath('/docentes');
  revalidatePath('/admin/circulares');
}
