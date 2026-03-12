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
    contactEmail: z.string().email('Bitte gültige E-Mail-Adresse eingeben').optional().or(z.literal('')),
    contactName: z.string().max(100).optional().or(z.literal('')),
    contactPhone: z.string().max(30).optional().or(z.literal('')),
    maxUsers: z.number().int().min(1).max(10000).optional(),
});
export const tenantUpdateSchema = tenantCreateSchema.partial();
// === Region Management ===
export const regionCreateSchema = z.object({
    tenantId: z.string().min(1),
    name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben').max(100),
    description: z.string().max(500).optional().or(z.literal('')),
    sortOrder: z.number().int().min(0).optional(),
});
export const regionUpdateSchema = regionCreateSchema.omit({ tenantId: true }).partial();
export const regionStoreAssignSchema = z.object({
    storeIds: z.array(z.string().min(1)),
});
// === Store Management ===
export const storeCreateSchema = z.object({
    tenantId: z.string().min(1),
    name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben').max(100),
    city: z.string().max(100).optional().or(z.literal('')),
    address: z.string().max(200).optional().or(z.literal('')),
    regionId: z.string().min(1).optional().or(z.literal('')),
});
export const storeUpdateSchema = storeCreateSchema.omit({ tenantId: true }).partial();
export const storeToolAssignSchema = z.object({
    storeId: z.string().min(1),
    toolId: z.string().min(1),
});
// === User Management ===
const userRoleEnum = z.enum([
    'kore_admin',
    'tenant_admin',
    'regional_manager',
    'multisite_manager',
    'store_manager',
    'learner',
]);
export const userCreateSchema = z.object({
    name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben').max(100),
    email: z.string().email('Bitte gültige E-Mail-Adresse eingeben'),
    password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen haben'),
    role: userRoleEnum,
    tenantId: z.string().min(1).optional(), // Required für alle außer kore_admin
    storeIds: z.array(z.string().min(1)).optional(),
    regionIds: z.array(z.string().min(1)).optional(),
});
export const userUpdateSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    role: userRoleEnum.optional(),
    isActive: z.boolean().optional(),
    storeIds: z.array(z.string().min(1)).optional(),
    regionIds: z.array(z.string().min(1)).optional(),
});
export const userStoreAssignSchema = z.object({
    storeIds: z.array(z.string().min(1)),
});
export const userRegionAssignSchema = z.object({
    regionIds: z.array(z.string().min(1)),
});
export const storeUserAssignSchema = z.object({
    userIds: z.array(z.string().min(1)),
});
// ============================================================
// Store Excellence Audit — Validators
// ============================================================
export const auditCriterionSchema = z.object({
    name: z.string().min(2).max(200),
    description: z.string().max(500).optional(),
    sortOrder: z.number().int().min(0).optional(),
    isRequired: z.boolean().optional(),
    photoRequired: z.boolean().optional(),
});
export const auditCategorySchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
    sortOrder: z.number().int().min(0).optional(),
    weight: z.number().min(0).max(100).optional(),
    criteria: z.array(auditCriterionSchema).optional(),
});
export const auditTemplateCreateSchema = z.object({
    name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben').max(100),
    description: z.string().max(500).optional(),
    categories: z.array(auditCategorySchema).optional(),
});
export const auditTemplateUpdateSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(500).optional(),
});
export const auditSessionCreateSchema = z.object({
    storeId: z.string().min(1, 'Store muss ausgewählt werden'),
    templateId: z.string().min(1, 'Template muss ausgewählt werden'),
    storeLocation: z.string().max(200).optional(),
    notes: z.string().max(2000).optional(),
});
export const auditResponseSchema = z.object({
    scorePercent: z.number().int().min(0).max(100).optional().nullable(),
    passed: z.boolean().optional().nullable(),
    comment: z.string().max(1000).optional().nullable(),
});
// ============================================================
// Checklisten Tool — Validators
// ============================================================
export const checklistTemplateCreateSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
    sections: z.array(z.object({
        name: z.string().min(1).max(100),
        sortOrder: z.number().int().min(0).default(0),
        items: z.array(z.object({
            text: z.string().min(1).max(500),
            type: z.enum(['BOOLEAN', 'TEXT', 'NUMBER', 'PHOTO']).default('BOOLEAN'),
            isRequired: z.boolean().default(false),
            sortOrder: z.number().int().min(0).default(0),
        })),
    })).min(1),
});
export const checklistTemplateUpdateSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(500).optional(),
});
export const checklistSessionCreateSchema = z.object({
    storeId: z.string().min(1),
    templateId: z.string().min(1),
    notes: z.string().max(1000).optional(),
});
export const checklistEntrySchema = z.object({
    valueBool: z.boolean().nullable().optional(),
    valueText: z.string().max(2000).nullable().optional(),
    valueNumber: z.number().nullable().optional(),
    comment: z.string().max(1000).nullable().optional(),
});
// ============================================================
// SOP Bibliothek — Validators
// ============================================================
export const sopCategoryCreateSchema = z.object({
    name: z.string().min(1).max(100),
    sortOrder: z.number().int().min(0).default(0),
});
export const sopCreateSchema = z.object({
    categoryId: z.string().min(1),
    title: z.string().min(2).max(200),
    content: z.string().min(1),
});
export const sopUpdateSchema = z.object({
    categoryId: z.string().min(1).optional(),
    title: z.string().min(2).max(200).optional(),
    content: z.string().min(1).optional(),
});
// ============================================================
// VM Foto-Compliance — Validators
// ============================================================
export const vmGuidelineCreateSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
    category: z.string().max(50).optional(),
});
export const vmGuidelineUpdateSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(500).optional(),
    category: z.string().max(50).optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
});
export const vmSubmissionCreateSchema = z.object({
    guidelineId: z.string().min(1),
    storeId: z.string().min(1),
});
export const vmReviewSchema = z.object({
    status: z.enum(['APPROVED', 'REJECTED']),
    reviewNote: z.string().max(1000).optional(),
});
// ============================================================
// Store Standards — Validators
// ============================================================
export const standardCategoryCreateSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
    sortOrder: z.number().int().min(0).default(0),
});
export const standardCategoryUpdateSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(500).optional(),
    sortOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
});
export const standardDefinitionCreateSchema = z.object({
    categoryId: z.string().min(1),
    name: z.string().min(2).max(200),
    description: z.string().max(500).optional(),
    unit: z.string().max(20).optional(),
    targetValue: z.number(),
    operator: z.enum(['GTE', 'LTE', 'EQ', 'GT', 'LT']).default('GTE'),
    weight: z.number().min(0).default(1),
    sortOrder: z.number().int().min(0).default(0),
});
export const standardDefinitionUpdateSchema = z.object({
    name: z.string().min(2).max(200).optional(),
    description: z.string().max(500).optional(),
    unit: z.string().max(20).optional(),
    targetValue: z.number().optional(),
    operator: z.enum(['GTE', 'LTE', 'EQ', 'GT', 'LT']).optional(),
    weight: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
});
export const standardEvaluationCreateSchema = z.object({
    storeId: z.string().min(1),
    period: z.string().min(1).max(20),
    notes: z.string().max(2000).optional(),
});
export const standardScoreSchema = z.object({
    actualValue: z.number(),
    comment: z.string().max(1000).optional(),
});
// ============================================================
// KPI Dashboard (Pulse) — Validators
// ============================================================
export const kpiEntryUpsertSchema = z.object({
    storeId: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    revenue: z.number().min(0),
    transactions: z.number().int().min(0),
    footfall: z.number().int().min(0).optional(),
    unitsSold: z.number().int().min(0).optional(),
    staffHours: z.number().min(0).optional(),
});
// ============================================================
// Budget Tracker — Validators
// ============================================================
export const budgetPeriodCreateSchema = z.object({
    storeId: z.string().min(1),
    period: z.string().min(1).max(20),
    budgetType: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']).default('MONTHLY'),
    revenue: z.number().min(0).default(0),
    cogs: z.number().min(0).default(0),
    labor: z.number().min(0).default(0),
    rent: z.number().min(0).default(0),
    marketing: z.number().min(0).default(0),
    other: z.number().min(0).default(0),
    notes: z.string().max(2000).optional(),
});
export const budgetPeriodUpdateSchema = budgetPeriodCreateSchema.omit({ storeId: true, period: true, budgetType: true }).partial();
export const budgetActualCreateSchema = z.object({
    category: z.enum(['REVENUE', 'COGS', 'LABOR', 'RENT', 'MARKETING', 'OTHER']),
    actualAmount: z.number(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    description: z.string().max(500).optional(),
});
// ============================================================
// Forecast — Validators
// ============================================================
export const forecastCreateSchema = z.object({
    storeId: z.string().min(1),
    period: z.string().min(1).max(20),
    forecastType: z.enum(['REVENUE', 'TRANSACTIONS', 'FOOTFALL']).default('REVENUE'),
    forecastValue: z.number(),
    confidence: z.number().min(0).max(100).optional(),
    method: z.enum(['MANUAL', 'TREND', 'AI']).default('MANUAL'),
    notes: z.string().max(2000).optional(),
});
export const forecastUpdateSchema = z.object({
    forecastValue: z.number().optional(),
    actualValue: z.number().optional(),
    confidence: z.number().min(0).max(100).optional(),
    notes: z.string().max(2000).optional(),
});
// ============================================================
// Loss Prevention — Validators
// ============================================================
export const lossIncidentCreateSchema = z.object({
    storeId: z.string().min(1),
    incidentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    category: z.enum(['THEFT', 'DAMAGE', 'ADMIN_ERROR', 'SUPPLIER', 'OTHER']),
    amount: z.number().min(0),
    description: z.string().min(5).max(2000),
    severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
});
export const lossIncidentUpdateSchema = z.object({
    status: z.enum(['OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED']).optional(),
    severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    resolution: z.string().max(2000).optional(),
    assignedTo: z.string().min(1).optional(),
});
// ============================================================
// Inventory — Validators
// ============================================================
export const inventoryCountCreateSchema = z.object({
    storeId: z.string().min(1),
    countDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    countType: z.enum(['FULL', 'PARTIAL', 'CYCLE']).default('FULL'),
    notes: z.string().max(2000).optional(),
});
export const inventoryItemUpsertSchema = z.object({
    sku: z.string().min(1).max(50),
    productName: z.string().min(1).max(200),
    category: z.string().max(100).optional(),
    expectedQty: z.number().int().min(0),
    actualQty: z.number().int().min(0),
    unitPrice: z.number().min(0),
    notes: z.string().max(500).optional(),
});
// ============================================================
// Live Floor — Validators
// ============================================================
export const floorZoneCreateSchema = z.object({
    storeId: z.string().min(1),
    name: z.string().min(1).max(100),
    sortOrder: z.number().int().min(0).default(0),
});
export const floorZoneUpdateSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    sortOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
});
export const floorPositionCreateSchema = z.object({
    storeId: z.string().min(1),
    zoneId: z.string().min(1).optional(),
    userId: z.string().min(1),
    userName: z.string().min(1).max(100),
    status: z.enum(['ON_FLOOR', 'ON_BREAK', 'OFF_FLOOR', 'CASHIER']).default('ON_FLOOR'),
    notes: z.string().max(500).optional(),
});
export const floorPositionUpdateSchema = z.object({
    zoneId: z.string().min(1).nullable().optional(),
    status: z.enum(['ON_FLOOR', 'ON_BREAK', 'OFF_FLOOR', 'CASHIER']).optional(),
    notes: z.string().max(500).optional(),
    endedAt: z.string().optional(),
});
// ============================================================
// FR Tracking — Validators
// ============================================================
export const footfallUpsertSchema = z.object({
    storeId: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    hour: z.number().int().min(0).max(23).optional(),
    footfall: z.number().int().min(0),
    revenue: z.number().min(0).optional(),
    transactions: z.number().int().min(0).optional(),
});
// ============================================================
// VM Guidelines — Validators
// ============================================================
export const vmGuidelineDocCreateSchema = z.object({
    title: z.string().min(2).max(200),
    category: z.string().max(50).optional(),
    content: z.string().min(1),
    effectiveFrom: z.string().optional(),
});
export const vmGuidelineDocUpdateSchema = z.object({
    title: z.string().min(2).max(200).optional(),
    category: z.string().max(50).optional(),
    content: z.string().min(1).optional(),
    effectiveFrom: z.string().optional(),
});
// ============================================================
// Maintenance — Validators
// ============================================================
export const maintenanceRequestCreateSchema = z.object({
    storeId: z.string().min(1),
    title: z.string().min(2).max(200),
    description: z.string().min(5).max(2000),
    category: z.enum(['ELECTRICAL', 'PLUMBING', 'HVAC', 'FIXTURE', 'IT', 'OTHER']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
});
export const maintenanceRequestUpdateSchema = z.object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().min(5).max(2000).optional(),
    category: z.enum(['ELECTRICAL', 'PLUMBING', 'HVAC', 'FIXTURE', 'IT', 'OTHER']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
    assignedTo: z.string().min(1).optional(),
    estimatedCost: z.number().min(0).optional(),
    actualCost: z.number().min(0).optional(),
    resolution: z.string().max(2000).optional(),
});
//# sourceMappingURL=validators.js.map