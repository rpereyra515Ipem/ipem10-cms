'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, hashPassword, validatePasswordSecurity } from '@/lib/password';
import { createSession, destroySession, getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { logSecurityEvent } from '@/lib/auditLogger';

export async function loginAction(formData: FormData): Promise<{ error?: string }> {
  const email = (formData.get('email') as string)?.toLowerCase().trim();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Por favor complete su correo y contraseña.' };
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  // 1. Caso: Usuario no existe en el sistema
  if (!user) {
    await logSecurityEvent({
      severity: 'HIGH',
      action: 'LOGIN_FAILED',
      category: 'AUTH',
      status: 'FAILED',
      actorId: email,
      actorRole: 'GUEST',
      details: { motivo: 'Correo no registrado' },
    });
    return { error: 'Credenciales inválidas o cuenta inactiva.' };
  }

  // 2. Caso: Cuenta deshabilitada
  if (!user.active) {
    await logSecurityEvent({
      severity: 'HIGH',
      action: 'LOGIN_BLOCKED_INACTIVE_USER',
      category: 'AUTH',
      status: 'FAILED',
      actorId: user.id,
      actorRole: user.role,
      targetResource: `user:${user.id}`,
      details: { email: user.email, motivo: 'Intento de acceso con cuenta inactiva' },
    });
    return { error: 'Credenciales inválidas o cuenta inactiva.' };
  }

  // 3. Caso: Contraseña incorrecta
  const matches = await verifyPassword(password, user.passwordHash);
  if (!matches) {
    await logSecurityEvent({
      severity: 'HIGH',
      action: 'LOGIN_FAILED',
      category: 'AUTH',
      status: 'FAILED',
      actorId: user.id,
      actorRole: user.role,
      targetResource: `user:${user.id}`,
      details: { email: user.email, motivo: 'Contraseña incorrecta' },
    });
    return { error: 'Credenciales inválidas.' };
  }

  // 4. Caso: Inicio de sesión exitoso
  await logSecurityEvent({
    severity: user.role === 'ADMIN' ? 'MEDIUM' : 'LOW',
    action: 'LOGIN_SUCCESS',
    category: 'AUTH',
    status: 'SUCCESS',
    actorId: user.id,
    actorRole: user.role,
    targetResource: `user:${user.id}`,
    details: { email: user.email, rol: user.role },
  });

  // Crear la sesión encriptada (con compatibilidad de roles)
  await createSession({
    userId: user.id,
    role: user.role as any,
    fullName: user.fullName,
  });

  // Si debe cambiar contraseña obligatoria (primer ingreso)
  if (user.mustChangePassword) {
    redirect('/cambiar-password');
  }

  // Redirección inteligente según el rol
  if ((user.role as string) === 'DOCENTE') {
    redirect('/docentes');
  }

  redirect('/admin');
}

export async function changePasswordAction(formData: FormData): Promise<{ error?: string }> {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (newPassword !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden.' };
  }

  const validation = validatePasswordSecurity(newPassword);
  if (!validation.isValid) {
    return { error: validation.errorMessage || 'Contraseña no cumple los requisitos.' };
  }

  const newHash = await hashPassword(newPassword);

  await db
    .update(users)
    .set({
      passwordHash: newHash,
      mustChangePassword: false,
    })
    .where(eq(users.id, session.userId));

  // Registrar el cambio de contraseña en auditoría
  await logSecurityEvent({
    severity: 'MEDIUM',
    action: 'PASSWORD_CHANGED',
    category: 'AUTH',
    status: 'SUCCESS',
    actorId: session.userId,
    actorRole: session.role,
    targetResource: `user:${session.userId}`,
    details: { motivo: 'Cambio de contraseña exitoso' },
  });

  // Redirigir según su rol al finalizar el cambio
  if ((session.role as string) === 'DOCENTE') {
    redirect('/docentes');
  }

  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  if (session) {
    await logSecurityEvent({
      severity: 'LOW',
      action: 'LOGOUT',
      category: 'AUTH',
      status: 'SUCCESS',
      actorId: session.userId,
      actorRole: session.role,
    });
  }

  await destroySession();
  redirect('/login');
}
