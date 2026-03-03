import { z } from 'zod';

// === Website Forms ===

export const auditRequestSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben').max(100),
  company: z.string().min(2, 'Unternehmen muss mindestens 2 Zeichen haben').max(100),
  storeCount: z.string().min(1, 'Bitte Store-Anzahl angeben'),
  challenge: z.string().min(10, 'Bitte beschreiben Sie Ihre Herausforderung (min. 10 Zeichen)').max(1000),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben').max(100),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  company: z.string().max(100).optional(),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen haben').max(2000),
});

// === Auth ===

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// === Courses (Train) ===

export const courseCreateSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  estimatedMins: z.number().int().min(1).max(600).optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
});

export const moduleCreateSchema = z.object({
  title: z.string().min(2).max(100),
  order: z.number().int().min(0),
});

export const lessonCreateSchema = z.object({
  title: z.string().min(2).max(100),
  type: z.enum(['VIDEO', 'TEXT', 'QUIZ', 'CHECKLIST']),
  content: z.record(z.unknown()),
  order: z.number().int().min(0),
  durationMins: z.number().int().min(1).max(120).optional(),
});

// === KPI (Pulse) ===

export const kpiEntrySchema = z.object({
  storeId: z.string().cuid(),
  date: z.string().date(),
  revenue: z.number().min(0),
  transactions: z.number().int().min(0),
  footfall: z.number().int().min(0).optional(),
  unitsSold: z.number().int().min(0).optional(),
  staffHours: z.number().min(0).optional(),
});

// === Tenant Management (Dashboard) ===

export const tenantCreateSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben').max(100),
  slug: z
    .string()
    .min(2, 'Slug muss mindestens 2 Zeichen haben')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten'),
  plan: z.enum(['STARTER', 'PROFESSIONAL', 'ENTERPRISE']),
  contactEmail: z.string().email('Bitte gültige E-Mail-Adresse eingeben').optional().or(z.literal('')),
  contactName: z.string().max(100).optional().or(z.literal('')),
  contactPhone: z.string().max(30).optional().or(z.literal('')),
  maxUsers: z.number().int().min(1).max(10000).optional(),
});

export const tenantUpdateSchema = tenantCreateSchema.partial();

export const toolAssignSchema = z.object({
  tenantId: z.string().min(1),
  tool: z.enum(['TRAIN', 'PULSE', 'SHIFT']),
});

// === Type Exports ===

export type AuditRequestInput = z.infer<typeof auditRequestSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CourseCreateInput = z.infer<typeof courseCreateSchema>;
export type KPIEntryInput = z.infer<typeof kpiEntrySchema>;
export type TenantCreateInput = z.infer<typeof tenantCreateSchema>;
export type TenantUpdateInput = z.infer<typeof tenantUpdateSchema>;
export type ToolAssignInput = z.infer<typeof toolAssignSchema>;
