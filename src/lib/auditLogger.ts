import { db } from '@/db';
import { auditSecurityLogs } from '@/db/schema';
import { headers } from 'next/headers';

// Campos sensibles que nunca deben quedar registrados en texto plano
const SENSITIVE_KEYS = [
  'password',
  'passwordhash',
  'token',
  'secret',
  'authorization',
  'cookie',
  'credential',
];

function sanitize(data: any): any {
  if (!data || typeof data !== 'object') return data;
  const clean: Record<string, any> = Array.isArray(data) ? [] : {};
  for (const key of Object.keys(data)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s))) {
      clean[key] = '***REDACTED***';
    } else if (typeof data[key] === 'object') {
      clean[key] = sanitize(data[key]);
    } else {
      clean[key] = data[key];
    }
  }
  return clean;
}

export interface SecurityAuditParams {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  action: string;
  category: 'AUTH' | 'USER_MGMT' | 'CONTENT' | 'CONFIG' | 'SECURITY';
  status: 'SUCCESS' | 'FAILED';
  actorId?: string | null;
  actorRole?: string | null;
  targetResource?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  details?: Record<string, any> | null;
}

/**
 * Registra un evento de auditoría de seguridad en la base de datos SQLite.
 * Detecta automáticamente IP y User-Agent si se ejecuta dentro de un Server Action o Route Handler.
 */
export async function logSecurityEvent({
  severity,
  action,
  category,
  status,
  actorId = null,
  actorRole = 'GUEST',
  targetResource = null,
  ipAddress = null,
  userAgent = null,
  details = null,
}: SecurityAuditParams) {
  try {
    let resolvedIp = ipAddress;
    let resolvedUserAgent = userAgent;

    if (!resolvedIp || !resolvedUserAgent) {
      try {
        const headerStore = await headers();
        resolvedIp =
          resolvedIp ||
          headerStore.get('x-forwarded-for') ||
          headerStore.get('x-real-ip') ||
          '127.0.0.1';
        resolvedUserAgent = resolvedUserAgent || headerStore.get('user-agent') || 'desconocido';
      } catch {
        resolvedIp = resolvedIp || '127.0.0.1';
        resolvedUserAgent = resolvedUserAgent || 'interno';
      }
    }

    await db.insert(auditSecurityLogs).values({
      severity,
      action,
      category,
      status,
      actorId,
      actorRole,
      targetResource,
      ipAddress: resolvedIp,
      userAgent: resolvedUserAgent,
      details: details ? JSON.stringify(sanitize(details)) : null,
    });

    if (severity === 'CRITICAL') {
      console.error(
        `🚨 [ALERTA AUDITORÍA CRÍTICA]: ${action} ejecutada por ${actorId || resolvedIp}`
      );
    }
  } catch (error) {
    console.error('Error al registrar evento de seguridad:', error);
  }
}
