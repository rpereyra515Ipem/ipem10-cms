'use server';

import { db } from '@/db';
import { tramites } from '@/db/schema';
import { eq, or, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// 1. SOLICITUD PÚBLICA (Alumnos y Familias)
export async function crearSolicitudTramiteAction(formData: FormData) {
  try {
    const studentName = formData.get('studentName') as string;
    const studentDni = formData.get('studentDni') as string;
    const course = formData.get('course') as string;
    const requestType = formData.get('requestType') as string;
    const purpose = formData.get('purpose') as string || 'Trámite General';
    const contactPhone = formData.get('contactPhone') as string || '';
    const contactEmail = formData.get('contactEmail') as string || '';

    if (!studentName || !studentDni || !course || !requestType) {
      return { success: false, error: 'Por favor completa todos los campos obligatorios.' };
    }

    // Generar código único institucional: ej. TR-10-8421
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `TR-10-${randomNum}`;
    const now = new Date().toISOString();

    await db.insert(tramites).values({
      trackingCode,
      studentName: studentName.trim(),
      studentDni: studentDni.trim().replace(/\./g, ''),
      course: course.trim(),
      requestType,
      purpose: purpose.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      status: 'PENDIENTE',
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath('/admin/secretaria/tramites');
    revalidatePath('/secretaria');

    return {
      success: true,
      trackingCode,
      studentName,
      requestType,
    };
  } catch (error: any) {
    console.error('Error al crear trámite:', error);
    return { success: false, error: 'No se pudo registrar la solicitud. Intenta nuevamente.' };
  }
}

// 2. CONSULTA PÚBLICA DE ESTADO (Por DNI o Código)
export async function consultarEstadoTramiteAction(termino: string) {
  try {
    const term = termino.trim().replace(/\./g, '');
    if (!term) return { success: false, error: 'Ingresa un DNI o código válido.' };

    const resultados = await db
      .select()
      .from(tramites)
      .where(or(eq(tramites.trackingCode, term.toUpperCase()), eq(tramites.studentDni, term)))
      .orderBy(desc(tramites.createdAt))
      .limit(5);

    if (resultados.length === 0) {
      return { success: false, error: 'No se encontraron trámites registrados con ese DNI o código.' };
    }

    return { success: true, tramites: resultados };
  } catch (error: any) {
    return { success: false, error: 'Error al consultar el estado.' };
  }
}

// 3. ACTUALIZACIÓN PROTEGIDA (Solo Secretaría y Directivos)
export async function actualizarEstadoTramiteAction(
  id: number,
  nuevoEstado: string,
  internalNotes?: string
) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value || cookieStore.get('auth_token')?.value;

    if (!sessionCookie) {
      return { success: false, error: 'Acceso no autorizado.' };
    }

    await db
      .update(tramites)
      .set({
        status: nuevoEstado,
        internalNotes: internalNotes !== undefined ? internalNotes : undefined,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(tramites.id, id));

    revalidatePath('/admin/secretaria/tramites');
    revalidatePath('/secretaria');

    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'Error al actualizar el estado del trámite.' };
  }
}
