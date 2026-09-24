import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  role: text('role', { enum: ['ADMIN', 'SECRETARIA', 'DOCENTE'] }).notNull().default('DOCENTE'),
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