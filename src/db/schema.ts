import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(), // Correo oficial @ipem10.edu.ar (para login)
  personalEmail: text('personal_email'),   // <-- AQUÍ: Correo personal de contacto (opcional
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  role: text('role', { enum: ['MASTER', 'DIRECTIVO', 'ADMIN', 'SECRETARIA', 'PRECEPTOR', 'DOCENTE'] }).notNull().default('DOCENTE'),
  mustChangePassword: integer('must_change_password', { mode: 'boolean' }).notNull().default(true),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),
  contentHtml: text('content_html').notNull(),
  imageUrl: text('image_url'),
  type: text('type', {
    enum: ['NOTICIA', 'AVISO_URGENTE', 'MESA_EXAMEN', 'INSTITUCIONAL']
  }).notNull().default('NOTICIA'),
  status: text('status', { enum: ['DRAFT', 'PUBLISHED'] }).notNull().default('DRAFT'),
  isUrgent: integer('is_urgent', { mode: 'boolean' }).notNull().default(false),
  userId: text('user_id').notNull(),
  publishedAt: text('published_at'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const exams = sqliteTable('exams', {
  id: text('id').primaryKey(),
  subject: text('subject').notNull(),
  yearLevel: text('year_level').notNull(),
  shift: text('shift', { enum: ['MAÑANA', 'TARDE', 'AMBOS'] }).notNull().default('MAÑANA'),
  callName: text('call_name').notNull(),
  examDate: text('exam_date').notNull(),
  examTime: text('exam_time').notNull(),
  teachers: text('teachers').notNull(),
  classroom: text('classroom'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category', { enum: ['PROGRAMA', 'FORMULARIO', 'NORMATIVA'] }).notNull(),
  yearLevel: text('year_level').notNull().default('TODOS'),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  fileSize: text('file_size'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const memos = sqliteTable('memos', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  sender: text('sender').notNull().default('Dirección / Vicedirección'),
  priority: text('priority', { enum: ['NORMAL', 'URGENTE'] }).notNull().default('NORMAL'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Logs de seguridad y auditoría para el Administrador Master
export const auditSecurityLogs = sqliteTable(
  'audit_security_logs',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    timestamp: text('timestamp').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
    severity: text('severity', { enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] }).notNull(),
    action: text('action').notNull(),
    category: text('category').notNull(), // 'AUTH', 'USER_MGMT', 'CONTENT', 'CONFIG', etc.
    status: text('status', { enum: ['SUCCESS', 'FAILED'] }).notNull(),
    actorId: text('actor_id'),
    actorRole: text('actor_role'),
    targetResource: text('target_resource'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    details: text('details'), // JSON con contexto (motivos de fallo, cambios de rol, etc.)
  },
  (table) => ({
    timestampSeverityIdx: index('idx_audit_timestamp_severity').on(table.timestamp, table.severity),
    actorIdx: index('idx_audit_actor').on(table.actorId),
  })
);

export type AuditSecurityLog = typeof auditSecurityLogs.$inferSelect;
export type NewAuditSecurityLog = typeof auditSecurityLogs.$inferInsert;

// Novedades y Avisos de Preceptoría (Horas Libres, Citaciones, Cambios de Horario)
export const preceptoriaNotices = sqliteTable('preceptoria_notices', {
  id: text('id').primaryKey(),
  yearLevel: text('year_level').notNull(), // 1° Año a 6° Año o TODOS
  division: text('division').notNull(),   // A, B, C o TODAS
  shift: text('shift', { enum: ['MAÑANA', 'TARDE', 'AMBOS'] }).notNull().default('MAÑANA'),
  type: text('type', {
    enum: ['HORA_LIBRE', 'CAMBIO_HORARIO', 'CITACION_FAMILIA', 'COMUNICADO_CURSO']
  }).notNull().default('COMUNICADO_CURSO'),
  title: text('title').notNull(),
  content: text('content').notNull(),
  effectiveDate: text('effective_date').notNull(), // Fecha en que aplica (ej: 2026-09-26)
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export type PreceptoriaNotice = typeof preceptoriaNotices.$inferSelect;
export type NewPreceptoriaNotice = typeof preceptoriaNotices.$inferInsert;
export const tramites = sqliteTable('tramites', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  trackingCode: text('tracking_code').notNull().unique(),
  studentName: text('student_name').notNull(),
  studentDni: text('student_dni').notNull(),
  course: text('course').notNull(),
  requestType: text('request_type').notNull(),
  purpose: text('purpose'),
  contactPhone: text('contact_phone'),
  contactEmail: text('contact_email'),
  status: text('status').notNull().default('PENDIENTE'),
  internalNotes: text('internal_notes'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
// ============================================================================
// CÉDULAS DE NOTIFICACIÓN Y CITACIONES INDIVIDUALES A FAMILIAS
// ============================================================================
export const studentNotices = sqliteTable('student_notices', {
  id: text('id').primaryKey(),
  token: text('token').notNull().unique(),
  code: text('code').notNull().unique(), // Ej: CIT-2026-0042
  studentName: text('student_name').notNull(),
  studentDni: text('student_dni').notNull(),
  yearLevel: text('year_level').notNull(), // 1° Año, 2° Año, ..., 6° Año
  division: text('division').notNull(), // A, B, C, D
  shift: text('shift').notNull(), // MAÑANA (Informática) | TARDE (Robótica)
  parentName: text('parent_name'),
  parentPhone: text('parent_phone'),
  type: text('type').notNull(), // CITACION_PRESENCIAL, ALERTA_INASISTENCIAS, INFORME_PEDAGOGICO, DOCUMENTACION_PENDIENTE, COMUNICADO_INDIVIDUAL
  title: text('title').notNull(),
  message: text('message').notNull(),
  meetingDate: text('meeting_date'), // YYYY-MM-DD
  meetingTime: text('meeting_time'), // HH:MM
  meetingPlace: text('meeting_place'), // Ej: Preceptoría PB
  status: text('status').notNull().default('ENVIADO'), // ENVIADO | LEIDO | CONFORMADO
  acknowledgedAt: text('acknowledged_at'),
  parentNote: text('parent_note'),
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});