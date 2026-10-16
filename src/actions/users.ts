'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import { logSecurityEvent } from '@/lib/auditLogger';
import { randomUUID, randomBytes } from 'crypto';
import { revalidatePath } from 'next/cache';
import { eq, desc } from 'drizzle-orm';

const ALLOWED_ADMINS = ['MASTER', 'DIRECTIVO', 'ADMIN'];

export async function createUserAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session || !ALLOWED_ADMINS.includes(session.role)) {
    await logSecurityEvent({
      severity: 'HIGH',
      action: 'UNAUTHORIZED_USER_CREATION_ATTEMPT',
      category: 'SECURITY',
      status: 'FAILED',
      actorId: session?.userId || 'anonymous',
      actorRole: session?.role || 'GUEST',
    });
    return;
  }

  const fullName = (formData.get('fullName') as string)?.trim();
  const email = (formData.get('email') as string)?.toLowerCase().trim();
  const personalEmail = (formData.get('personalEmail') as string)?.toLowerCase().trim() || null;
  const role = formData.get('role') as 'DIRECTIVO' | 'SECRETARIA' | 'PRECEPTOR' | 'DOCENTE';
  const customPassword = (formData.get('password') as string)?.trim();

  if (!fullName || !email || !role) return;

  // Regla de Ciberseguridad: Un Directivo no puede crear otros Directivos ni Masters
  if (session.role === 'DIRECTIVO' && (role === ('MASTER' as any) || role === 'DIRECTIVO')) {
    await logSecurityEvent({
      severity: 'HIGH',
      action: 'PRIVILEGE_ESCALATION_BLOCKED',
      category: 'SECURITY',
      status: 'FAILED',
      actorId: session.userId,
      actorRole: session.role,
      details: { intento: `Directivo intentó crear rol ${role}` },
    });
    return;
  }

  // Si no se asigna contraseña, se genera un hash seguro para acceso con Google Workspace
  const passwordToHash = customPassword || randomBytes(24).toString('hex');
  const passwordHash = await hashPassword(passwordToHash);

  const newId = randomUUID();

  try {
    await db.insert(users).values({
      id: newId,
      email,
      personalEmail,
      fullName,
      passwordHash,
      role,
      mustChangePassword: !!customPassword,
      active: true,
    });

    await logSecurityEvent({
      severity: 'MEDIUM',
      action: 'USER_CREATED',
      category: 'USER_MGMT',
      status: 'SUCCESS',
      actorId: session.userId,
      actorRole: session.role,
      targetResource: `user:${newId}`,
      details: { email, role, fullName, loginMetodo: customPassword ? 'Clave inicial' : 'Google Workspace' },
    });

    revalidatePath('/admin/usuarios');
  } catch (error) {
    console.error('Error al crear usuario:', error);
  }
}

export async function toggleUserStatusAction(userId: string, currentStatus: boolean): Promise<void> {
  const session = await getSession();
  if (!session || !ALLOWED_ADMINS.includes(session.role)) return;

  // Regla: No puedes desactivarte a ti mismo
  if (session.userId === userId) return;

  const [targetUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!targetUser) return;

  // Regla: Un Directivo no puede desactivar a un Master ni a otro Directivo
  if (session.role === 'DIRECTIVO' && (targetUser.role === 'MASTER' || targetUser.role === 'DIRECTIVO')) {
    return;
  }

  const nextStatus = !currentStatus;

  await db.update(users).set({ active: nextStatus }).where(eq(users.id, userId));

  await logSecurityEvent({
    severity: 'MEDIUM',
    action: nextStatus ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
    category: 'USER_MGMT',
    status: 'SUCCESS',
    actorId: session.userId,
    actorRole: session.role,
    targetResource: `user:${userId}`,
    details: { targetEmail: targetUser.email, nuevoEstado: nextStatus ? 'Activo' : 'Suspendido' },
  });

  revalidatePath('/admin/usuarios');
}

export async function getUsersList() {
  return await db.select({
    id: users.id,
    email: users.email,
    personalEmail: users.personalEmail,
    fullName: users.fullName,
    role: users.role,
    active: users.active,
    createdAt: users.createdAt,
  }).from(users).orderBy(desc(users.createdAt));
}
