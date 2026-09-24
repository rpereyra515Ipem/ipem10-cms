import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { db } from '@/db';
import { auditSecurityLogs } from '@/db/schema';
import { sql, and, gte, inArray, desc } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import nodemailer from 'nodemailer';

function buildHtmlReport(summary: any[], highRiskEvents: any[]): string {
  let summaryRows = '';
  if (summary.length === 0) {
    summaryRows = '<tr><td colspan="2" style="padding: 10px;">Sin eventos registrados.</td></tr>';
  } else {
    for (const s of summary) {
      const emoji = s.severity === 'CRITICAL' ? '🔴' : s.severity === 'HIGH' ? '🟠' : '🟢';
      summaryRows += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
            <b>${emoji} ${s.severity}</b>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${s.total}</td>
        </tr>`;
    }
  }

  let incidentCards = '';
  if (highRiskEvents.length === 0) {
    incidentCards = '<p style="color: #16a34a;">✅ No se registraron incidentes críticos ni altos esta semana.</p>';
  } else {
    for (const ev of highRiskEvents) {
      const detailsHtml = ev.details ? `<br/><b>Detalles:</b> <code>${ev.details}</code>` : '';
      incidentCards += `
        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin-bottom: 10px; border-radius: 4px;">
          <div style="font-weight: bold; color: #991b1b;">${ev.action} [${ev.severity}]</div>
          <div style="font-size: 13px; color: #4b5563; margin-top: 4px;">
            <b>Fecha:</b> ${ev.timestamp} | <b>Actor:</b> ${ev.actorId || 'Desconocido'} (${ev.actorRole})<br/>
            <b>IP:</b> ${ev.ipAddress} | <b>Estado:</b> ${ev.status}
            ${detailsHtml}
          </div>
        </div>`;
    }
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1e293b; color: #ffffff; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">🛡️ Auditoría de Seguridad Semanal</h2>
        <p style="margin: 5px 0 0 0; color: #94a3b8;">IPEM 10 Roma CMS</p>
      </div>
      
      <div style="padding: 20px;">
        <p>Estimado Administrador Master,</p>
        <p>Se ha generado el resumen automático de seguridad de los últimos 7 días:</p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f1f5f9; text-align: left;">
              <th style="padding: 10px; border-bottom: 2px solid #cbd5e1;">Criticidad</th>
              <th style="padding: 10px; border-bottom: 2px solid #cbd5e1;">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            ${summaryRows}
          </tbody>
        </table>

        <h3 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Incidentes que requieren atención</h3>
        ${incidentCards}

        <p style="font-size: 12px; color: #64748b; margin-top: 25px;">
          Este reporte fue generado de forma automática. Para cambiar los correos destinatarios, edita la variable <code>SECURITY_AUDIT_EMAIL</code> en <code>.env.local</code>.
        </p>
      </div>
    </div>`;
}

async function runAudit() {
  console.log('\n==================================================');
  console.log('🛡️  AUDITORÍA DE SEGURIDAD - IPEM 10 ROMA CMS');
  console.log('==================================================\n');

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dateStr = sevenDaysAgo.toISOString();

  // 1. Resumen agrupado por severidad
  const summary = await db
    .select({
      severity: auditSecurityLogs.severity,
      total: sql<number>`count(*)`,
    })
    .from(auditSecurityLogs)
    .where(gte(auditSecurityLogs.timestamp, dateStr))
    .groupBy(auditSecurityLogs.severity);

  console.log('📊 Resumen de eventos (últimos 7 días):');
  if (summary.length === 0) {
    console.log('   (No hay eventos registrados en este período)');
  } else {
    summary.forEach((s) => {
      const emoji =
        s.severity === 'CRITICAL' ? '🔴' :
        s.severity === 'HIGH' ? '🟠' :
        s.severity === 'MEDIUM' ? '🟡' : '🟢';
      console.log(`   ${emoji} ${s.severity}: ${s.total} eventos`);
    });
  }

  // 2. Detalle de eventos de riesgo (CRITICAL y HIGH)
  const highRiskEvents = await db
    .select()
    .from(auditSecurityLogs)
    .where(
      and(
        gte(auditSecurityLogs.timestamp, dateStr),
        inArray(auditSecurityLogs.severity, ['CRITICAL', 'HIGH'])
      )
    )
    .orderBy(desc(auditSecurityLogs.timestamp))
    .limit(20);

  console.log('\n🚨 Eventos de Riesgo:');
  if (highRiskEvents.length === 0) {
    console.log('   ✅ Ningún incidente crítico o alto detectado.');
  } else {
    highRiskEvents.forEach((ev, i) => {
      console.log(`   [${i + 1}] ${ev.timestamp} | ${ev.severity} | ${ev.action} | IP: ${ev.ipAddress}`);
    });
  }

  // 3. Guardar copia local en JSON
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const fileName = `audit_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  const reportPath = path.join(reportsDir, fileName);
  fs.writeFileSync(
    reportPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), summary, highRiskEvents }, null, 2)
  );
  console.log(`\n📁 Reporte guardado localmente en: reports/${fileName}`);

  // 4. Envío por Correo Electrónico
  const recipient = process.env.SECURITY_AUDIT_EMAIL || 'rpereyra.ipem10@gmail.com';
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.log('\nℹ️  Aviso de Envío de Correo:');
    console.log(`   Destinatario configurado: ${recipient}`);
    console.log('   Para enviar el email real, define SMTP_USER y SMTP_PASS en tu archivo .env.local');
    console.log('\n==================================================\n');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const htmlContent = buildHtmlReport(summary, highRiskEvents);

    console.log(`\n📧 Enviando correo a: ${recipient}...`);
    await transporter.sendMail({
      from: `"Seguridad IPEM 10" <${smtpUser}>`,
      to: recipient,
      subject: `[Auditoría IPEM 10] Resumen de Seguridad - ${new Date().toLocaleDateString('es-AR')}`,
      html: htmlContent,
      attachments: [
        {
          filename: fileName,
          path: reportPath,
        },
      ],
    });

    console.log('✅ Correo enviado con éxito.');
  } catch (mailError) {
    console.error('❌ Error al enviar el correo:', mailError);
  }

  console.log('\n==================================================\n');
}

runAudit()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error durante la auditoría:', err);
    process.exit(1);
  });