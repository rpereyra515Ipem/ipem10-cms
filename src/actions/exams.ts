'use server';

import { db } from '@/db';
import { exams } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

export async function createExamAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error('No autorizado: Debe iniciar sesión para cargar mesas de examen.');
  }

  const subject = formData.get('subject') as string;
  const yearLevel = formData.get('yearLevel') as string;
  const shift = formData.get('shift') as 'MAÑANA' | 'TARDE' | 'AMBOS';
  const callName = formData.get('callName') as string;
  const examDate = formData.get('examDate') as string;
  const examTime = formData.get('examTime') as string;
  const teachers = formData.get('teachers') as string;
  const classroom = formData.get('classroom') as string;

  if (!subject || !yearLevel || !examDate || !examTime || !teachers) {
    throw new Error('Todos los campos obligatorios deben completarse.');
  }

  await db.insert(exams).values({
    id: randomUUID(),
    subject,
    yearLevel,
    shift: shift || 'MAÑANA',
    callName: callName || 'Turno Regular',
    examDate,
    examTime,
    teachers,
    classroom: classroom || 'A confirmar',
  });

  revalidatePath('/mesas');
  revalidatePath('/admin/mesas');
}

export async function deleteExamAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error('No autorizado: Debe iniciar sesión para eliminar exámenes.');
  }

  const examId = formData.get('examId') as string;
  if (!examId) return;

  await db.delete(exams).where(eq(exams.id, examId));

  revalidatePath('/mesas');
  revalidatePath('/admin/mesas');
}
