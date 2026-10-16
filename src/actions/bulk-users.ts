'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export interface DocenteImportItem {
  nombre: string;
  email: string;
  personalEmail?: string;
  dni?: string;
  rol?: string;
}

export async function importarDocentesAction(docentes: DocenteImportItem[]) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value || cookieStore.get('auth_token')?.value;

    if (!sessionCookie) {
      return { success: false, error: 'Acceso denegado: debe iniciar sesión institucional.' };
    }

    let role = '';
    if (sessionCookie.startsWith('{')) {
      try {
        role = JSON.parse(sessionCookie).role;
      } catch {}
    } else {
      role = sessionCookie;
    }

    const rolesAutorizados = ['SECRETARIA', 'DIRECTIVO', 'MASTER', 'ADMIN'];
    if (role && !rolesAutorizados.includes(role.toUpperCase())) {
      return { success: false, error: 'Permisos insuficientes: solo Secretaría y Directivos pueden realizar carga masiva.' };
    }

    let creados = 0;
    let actualizados = 0;
    const errores: string[] = [];

    for (const doc of docentes) {
      const emailNorm = doc.email.trim().toLowerCase();
      
      if (!emailNorm.endsWith('@ipem10.edu.ar')) {
        errores.push(`${doc.nombre || emailNorm}: El correo debe pertenecer al dominio @ipem10.edu.ar`);
        continue;
      }

      const rolValido = (doc.rol && ['DOCENTE', 'PRECEPTOR', 'SECRETARIA', 'DIRECTIVO', 'ADMIN', 'MASTER'].includes(doc.rol.toUpperCase()))
        ? (doc.rol.toUpperCase() as "DOCENTE" | "PRECEPTOR" | "SECRETARIA" | "DIRECTIVO" | "ADMIN" | "MASTER")
        : 'DOCENTE';

      const existing = await db.select().from(users).where(eq(users.email, emailNorm)).limit(1);

      if (existing.length > 0) {
        await db.update(users).set({
          fullName: doc.nombre || existing[0].fullName,
          personalEmail: doc.personalEmail || existing[0].personalEmail,
          role: rolValido,
          active: true,
        }).where(eq(users.email, emailNorm));
        actualizados++;
      } else {
        await db.insert(users).values({
          id: `usr_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`,
          fullName: doc.nombre || 'Docente IPEM 10',
          email: emailNorm,
          personalEmail: doc.personalEmail || null,
          role: rolValido,
          active: true,
          passwordHash: 'SSO_GOOGLE_WORKSPACE',
          mustChangePassword: false,
        });
        creados++;
      }
    }

    revalidatePath('/admin/usuarios');
    revalidatePath('/secretaria');

    return {
      success: true,
      creados,
      actualizados,
      errores,
      total: docentes.length,
    };
  } catch (error: any) {
    console.error('Error en carga masiva:', error);
    return {
      success: false,
      error: error.message || 'Error al procesar la carga en la base de datos',
    };
  }
}
