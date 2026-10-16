'use server';

import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { auditSecurityLogs } from '@/db/schema';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

export async function toggleMaintenanceAction() {
  const session = await getSession();
  if (!session || session.role !== 'MASTER') {
    return { success: false, error: 'Acceso denegado: solo el Webmaster Master puede alternar este modo.' };
  }

  // 1. Determinar el nuevo estado
  const current = process.env.MAINTENANCE_MODE === 'true';
  const nextState = !current;
  const strVal = nextState ? 'true' : 'false';

  // 2. Modificar process.env en memoria en el servidor
  process.env.MAINTENANCE_MODE = strVal;

  // 3. Persistir en el archivo .env para sobrevivir a reinicios
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      let content = fs.readFileSync(envPath, 'utf8');
      if (content.includes('MAINTENANCE_MODE=')) {
        content = content.replace(/MAINTENANCE_MODE=.*/g, `MAINTENANCE_MODE="${strVal}"`);
      } else {
        content += `\nMAINTENANCE_MODE="${strVal}"`;
      }
      if (content.includes('NEXT_PUBLIC_MAINTENANCE_MODE=')) {
        content = content.replace(/NEXT_PUBLIC_MAINTENANCE_MODE=.*/g, `NEXT_PUBLIC_MAINTENANCE_MODE="${strVal}"`);
      } else {
        content += `\nNEXT_PUBLIC_MAINTENANCE_MODE="${strVal}"`;
      }
      fs.writeFileSync(envPath, content, 'utf8');
    }
  } catch (err) {
    console.warn('No se pudo escribir en .env, cambio activo en memoria:', err);
  }

  // 4. Registro inmutable en la auditoría forense con category requerida
  try {
    await db.insert(auditSecurityLogs).values({
      timestamp: new Date().toISOString(),
      category: 'SYSTEM',
      severity: nextState ? 'HIGH' : 'MEDIUM',
      action: nextState ? 'MAINTENANCE_ENABLED' : 'MAINTENANCE_DISABLED',
      actorId: `${session.fullName} (${session.userId})`,
      ipAddress: '127.0.0.1 (Consola Master)',
      status: 'SUCCESS',
      details: `Modo mantenimiento cambiado a ${strVal} por el Master.`,
    });
  } catch (err) {
    console.error('Error registrando auditoría:', err);
  }

  revalidatePath('/admin');
  revalidatePath('/');

  return { success: true, isMaintenance: nextState };
}
