'use server';

import { db } from '@/db';
import { preceptoriaNotices } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { logSecurityEvent } from '@/lib/auditLogger';
import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { eq, desc } from 'drizzle-orm';

const ALLOWED_ROLES = ['MASTER', 'DIRECTIVO', 'ADMIN', 'PRECEPTOR'];

export async function createPreceptoriaNoticeAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session || !ALLOWED_ROLES.includes(session.role)) {
    await logSecurityEvent({
      severity: 'HIGH',
      action: 'UNAUTHORIZED_PRECEPTORIA_WRITE',
      category: 'SECURITY',
      status: 'FAILED',
      actorId: session?.userId || 'anonymous',
      actorRole: session?.role || 'GUEST',
      details: { intento: 'Crear aviso de preceptoría sin permisos' },
    });
    return;
  }

  const title = (formData.get('title') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();
  const yearLevel = (formData.get('yearLevel') as string) || 'TODOS';
  const division = (formData.get('division') as string) || 'TODAS';
  const shift = (formData.get('shift') as 'MAÑANA' | 'TARDE' | 'AMBOS') || 'MAÑANA';
  const type = (formData.get('type') as 'HORA_LIBRE' | 'CAMBIO_HORARIO' | 'CITACION_FAMILIA' | 'COMUNICADO_CURSO') || 'COMUNICADO_CURSO';
  const effectiveDate = (formData.get('effectiveDate') as string) || new Date().toISOString().split('T')[0];

  if (!title || !content) {
    return;
  }

  const newId = randomUUID();

  await db.insert(preceptoriaNotices).values({
    id: newId,
    yearLevel,
    division,
    shift,
    type,
    title,
    content,
    effectiveDate,
    authorId: session.userId,
    authorName: session.fullName,
  });

  // Registro de auditoría
  await logSecurityEvent({
    severity: 'LOW',
    action: 'PRECEPTORIA_NOTICE_CREATED',
    category: 'CONTENT',
    status: 'SUCCESS',
    actorId: session.userId,
    actorRole: session.role,
    targetResource: `preceptoria:${newId}`,
    details: { tipo: type, curso: `${yearLevel} ${division}`, titulo: title, fechaAplica: effectiveDate },
  });

  revalidatePath('/');
  revalidatePath('/preceptoria');
  
}

export async function deletePreceptoriaNoticeAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session || !ALLOWED_ROLES.includes(session.role)) {
    return;
  }

  await db.delete(preceptoriaNotices).where(eq(preceptoriaNotices.id, id));

  await logSecurityEvent({
    severity: 'MEDIUM',
    action: 'PRECEPTORIA_NOTICE_DELETED',
    category: 'CONTENT',
    status: 'SUCCESS',
    actorId: session.userId,
    actorRole: session.role,
    targetResource: `preceptoria:${id}`,
  });

  revalidatePath('/');
  revalidatePath('/preceptoria');
  
}

export async function getPreceptoriaNotices() {
  return await db
    .select()
    .from(preceptoriaNotices)
    .orderBy(desc(preceptoriaNotices.effectiveDate), desc(preceptoriaNotices.createdAt))
    .limit(30);
}
