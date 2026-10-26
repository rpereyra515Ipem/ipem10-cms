'use server';

import { db } from '@/db';
import { studentNotices } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

// 1. Crear Cédula de Notificación Individual y Enviar Email Automático por SMTP
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
  const parentEmail = (formData.get('parentEmail') as string)?.trim() || null;
  const type = formData.get('type') as string;
  const title = (formData.get('title') as string)?.trim();
  const message = (formData.get('message') as string)?.trim();
  const meetingDate = (formData.get('meetingDate') as string)?.trim() || null;
  const meetingTime = (formData.get('meetingTime') as string)?.trim() || null;
  const meetingPlace = (formData.get('meetingPlace') as string)?.trim() || null;
  const origin = (formData.get('origin') as string)?.trim() || 'https://ipem10.edu.ar';

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

  // Envío automático de Correo Electrónico vía SMTP si se ingresó parentEmail
  let emailSent = false;
  if (parentEmail && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const req = eval('require');
      const nodemailer = req('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const noticeUrl = `${origin}/comunicados/${token}`;
      const shiftLabel = shift === 'MAÑANA' ? 'Turno Mañana (Bachiller en Informática)' : 'Turno Tarde (Bachiller en Programación y Robótica)';

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 16px; overflow: hidden;">
          <div style="background-color: #022c22; color: #ffffff; padding: 24px; border-bottom: 4px solid #f59e0b;">
            <p style="margin: 0; font-size: 11px; color: #fbbf24; font-weight: bold; text-transform: uppercase;">Notificación Oficial • Cédula ${code}</p>
            <h2 style="margin: 6px 0 0 0; font-size: 20px;">IPEM N° 10 "Roma"</h2>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #a7f3d0;">Padre Lozano 375, Alto Alberdi, Córdoba • CUE 1404728-00</p>
          </div>
          <div style="padding: 24px; color: #1e293b; background-color: #ffffff;">
            <p style="font-size: 14px;">Estimada familia de <strong>${studentName}</strong> (${yearLevel} "${division}" - ${shiftLabel}):</p>
            <p style="font-size: 14px; line-height: 1.5;">Le informamos que desde la Preceptoría del establecimiento se ha emitido una <strong>Cédula de Notificación Oficial</strong> con el siguiente asunto:</p>
            <div style="background-color: #f8fafc; border-left: 4px solid #059669; padding: 14px; margin: 16px 0; border-radius: 6px;">
              <p style="margin: 0; font-weight: bold; font-size: 15px; color: #0f172a;">${title}</p>
              ${meetingDate ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #be123c;"><strong>📅 Citación:</strong> ${meetingDate} a las ${meetingTime \vert{}\vert{} '—'} hs en${meetingPlace || 'Preceptoría'}</p>` : ''}
            </div>
            <p style="font-size: 13px; color: #475569; line-height: 1.5;">Por razones de privacidad y protección de datos del estudiante (Ley N° 25.326), para leer el comunicado completo y <strong>firmar digitalmente el acuse de recibo</strong> debe ingresar con el <strong>DNI del alumno</strong> en el siguiente botón oficial:</p>
            <div style="text-align: center; margin: 28px 0;">
              <a href="${noticeUrl}" style="background-color: #047857; color: #ffffff; padding: 14px 24px; text-decoration: none; font-weight: bold; border-radius: 10px; font-size: 14px; display: inline-block;">
                Abrir Cédula Oficial y Dar Conformidad ➔
              </a>
            </div>
            <p style="font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px;">
              Emitido por: <strong>${session.fullName || 'Preceptoría Escolar'}</strong><br/>
              Teléfono de Guardia: (0351) 4347871
            </p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"IPEM N° 10 Roma - Preceptoría" <${process.env.SMTP_USER}>`,
        to: parentEmail,
        subject: `IPEM N° 10 Roma - Cédula Oficial ${code} (${studentName})`,
        html: htmlBody,
      });
      emailSent = true;
    } catch (err) {
      console.error('Error al enviar email SMTP:', err);
    }
  }

  revalidatePath('/preceptoria');
  revalidatePath('/admin');

  return { success: true, code, token, emailSent };
}

// 2. Obtener lista de citaciones
export async function getStudentNoticesList() {
  const session = await getSession();
  if (!session || !['MASTER', 'DIRECTIVO', 'ADMIN', 'PRECEPTOR'].includes(session.role)) {
    return [];
  }

  return await db.select().from(studentNotices).orderBy(desc(studentNotices.createdAt));
}

// 3. Obtener comunicado por token
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
