'use server';

import { db } from '@/db';
import { studentNotices } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';
import { logSecurityEvent } from '@/lib/auditLogger';

// 1. Crear Cédula de Notificación Individual
export async function createStudentNoticeAction(formData: FormData) {
  const session = await getSession();
  if (!session || !['MASTER', 'DIRECTIVO', 'ADMIN', 'PRECEPTOR'].includes(session.role)) {
    return { success: false, error: 'No tienes permisos para emitir notificaciones a familias.' };
  }

  const studentName = (formData.get('studentName') as string)?.trim();
  const studentDni = (formData.get('studentDni') as string)?.trim().replace(/\D/g, '');
  const yearLevel = formData.get('yearLevel') as string;
  const division = formData.get('division') as string;
  const shift = formData.get('shift') as string;
  const parentName = (formData.get('parentName') as string)?.trim() || null;
  const parentPhone = (formData.get('parentPhone') as string)?.trim() || null;
  const type = formData.get('type') as string;
  const title = (formData.get('title') as string)?.trim();
  const message = (formData.get('message') as string)?.trim();
  const meetingDate = (formData.get('meetingDate') as string)?.trim() || null;
  const meetingTime = (formData.get('meetingTime') as string)?.trim() || null;
  const meetingPlace = (formData.get('meetingPlace') as string)?.trim() || null;

  if (!studentName || !studentDni || !yearLevel || !division || !shift || !type || !title || !message) {
    return { success: false, error: 'Por favor complete los campos obligatorios (*).' };
  }

  const id = randomUUID();
  const token = randomUUID().replace(/-/g, '').slice(0, 16);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const code = `CIT-${new Date().getFullYear()}-${randomSuffix}`;

  await db.insert(studentNotices).values({
    id,
    token,
    code,
    studentName,
    studentDni,
    yearLevel,
    division,
    shift,
    parentName,
    parentPhone,
    type,
    title,
    message,
    meetingDate,
    meetingTime,
    meetingPlace,
    status: 'ENVIADO',
    authorId: session.userId,
    authorName: session.fullName || 'Preceptoría Escolar',
  });

  revalidatePath('/preceptoria');
  revalidatePath('/admin');

  return { success: true, code, token };
}

// 2. Obtener lista de citaciones para el panel
export async function getStudentNoticesList() {
  const session = await getSession();
  if (!session || !['MASTER', 'DIRECTIVO', 'ADMIN', 'PRECEPTOR'].includes(session.role)) {
    return [];
  }

  return await db.select().from(studentNotices).orderBy(desc(studentNotices.createdAt));
}

// 3. Obtener comunicado por token para la familia
export async function getStudentNoticeByToken(token: string) {
  if (!token) return null;
  const [notice] = await db.select().from(studentNotices).where(eq(studentNotices.token, token));
  return notice || null;
}

// 4. Firma Digital del Padre/Tutor
export async function acknowledgeStudentNoticeAction(token: string, inputDni: string, parentNote?: string) {
  if (!token || !inputDni) {
    return { success: false, error: 'Debe ingresar el DNI del alumno para validar.' };
  }

  const [notice] = await db.select().from(studentNotices).where(eq(studentNotices.token, token));
  if (!notice) {
    return { success: false, error: 'Cédula no encontrada.' };
  }

  const cleanInputDni = inputDni.trim().replace(/\D/g, '');
  const cleanStoredDni = notice.studentDni.trim().replace(/\D/g, '');

  if (cleanInputDni !== cleanStoredDni) {
    return { success: false, error: 'El DNI ingresado no coincide con el alumno notificado.' };
  }

  await db.update(studentNotices).set({
    status: 'CONFORMADO',
    acknowledgedAt: new Date().toISOString(),
    parentNote: parentNote?.trim() || null,
  }).where(eq(studentNotices.id, notice.id));

  revalidatePath(`/comunicados/${token}`);
  revalidatePath('/preceptoria');

  return { success: true };
}

// 5. Eliminar citación
export async function deleteStudentNoticeAction(id: string) {
  const session = await getSession();
  if (!session || !['MASTER', 'DIRECTIVO', 'ADMIN', 'PRECEPTOR'].includes(session.role)) {
    return { success: false, error: 'No autorizado.' };
  }

  await db.delete(studentNotices).where(eq(studentNotices.id, id));
  revalidatePath('/preceptoria');
  return { success: true };
}
