import { z } from 'zod';
export declare const auditRequestSchema: z.ZodObject<{
    name: z.ZodString;
    company: z.ZodString;
    storeCount: z.ZodString;
    challenge: z.ZodString;
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    company: string;
    storeCount: string;
    challenge: string;
    email: string;
}, {
    name: string;
    company: string;
    storeCount: string;
    challenge: string;
    email: string;
}>;
export declare const contactFormSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    company: z.ZodOptional<z.ZodString>;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    message: string;
    company?: string | undefined;
}, {
    name: string;
    email: string;
    message: string;
    company?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const courseCreateSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    estimatedMins: z.ZodOptional<z.ZodNumber>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description?: string | undefined;
    estimatedMins?: number | undefined;
    tags?: string[] | undefined;
}, {
    title: string;
    description?: string | undefined;
    estimatedMins?: number | undefined;
    tags?: string[] | undefined;
}>;
export declare const moduleCreateSchema: z.ZodObject<{
    title: z.ZodString;
    order: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    title: string;
    order: number;
}, {
    title: string;
    order: number;
}>;
export declare const lessonCreateSchema: z.ZodObject<{
    title: z.ZodString;
    type: z.ZodEnum<["VIDEO", "TEXT", "QUIZ", "CHECKLIST"]>;
    content: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    order: z.ZodNumber;
    durationMins: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "VIDEO" | "TEXT" | "QUIZ" | "CHECKLIST";
    title: string;
    order: number;
    content: Record<string, unknown>;
    durationMins?: number | undefined;
}, {
    type: "VIDEO" | "TEXT" | "QUIZ" | "CHECKLIST";
    title: string;
    order: number;
    content: Record<string, unknown>;
    durationMins?: number | undefined;
}>;
export declare const kpiEntrySchema: z.ZodObject<{
    storeId: z.ZodString;
    date: z.ZodString;
    revenue: z.ZodNumber;
    transactions: z.ZodNumber;
    footfall: z.ZodOptional<z.ZodNumber>;
    unitsSold: z.ZodOptional<z.ZodNumber>;
    staffHours: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    date: string;
    storeId: string;
    revenue: number;
    transactions: number;
    footfall?: number | undefined;
    unitsSold?: number | undefined;
    staffHours?: number | undefined;
}, {
    date: string;
    storeId: string;
    revenue: number;
    transactions: number;
    footfall?: number | undefined;
    unitsSold?: number | undefined;
    staffHours?: number | undefined;
}>;
export declare const tenantCreateSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    contactEmail: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    contactName: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    contactPhone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    maxUsers: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    contactEmail?: string | undefined;
    contactName?: string | undefined;
    contactPhone?: string | undefined;
    maxUsers?: number | undefined;
}, {
    name: string;
    slug: string;
    contactEmail?: string | undefined;
    contactName?: string | undefined;
    contactPhone?: string | undefined;
    maxUsers?: number | undefined;
}>;
export declare const tenantUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    contactEmail: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    contactName: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    contactPhone: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    maxUsers: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    slug?: string | undefined;
    contactEmail?: string | undefined;
    contactName?: string | undefined;
    contactPhone?: string | undefined;
    maxUsers?: number | undefined;
}, {
    name?: string | undefined;
    slug?: string | undefined;
    contactEmail?: string | undefined;
    contactName?: string | undefined;
    contactPhone?: string | undefined;
    maxUsers?: number | undefined;
}>;
export declare const storeCreateSchema: z.ZodObject<{
    tenantId: z.ZodString;
    name: z.ZodString;
    city: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    address: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    tenantId: string;
    city?: string | undefined;
    address?: string | undefined;
}, {
    name: string;
    tenantId: string;
    city?: string | undefined;
    address?: string | undefined;
}>;
export declare const storeUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    address: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    city?: string | undefined;
    address?: string | undefined;
}, {
    name?: string | undefined;
    city?: string | undefined;
    address?: string | undefined;
}>;
export declare const storeToolAssignSchema: z.ZodObject<{
    storeId: z.ZodString;
    toolId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    storeId: string;
    toolId: string;
}, {
    storeId: string;
    toolId: string;
}>;
export declare const userCreateSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["kore_admin", "tenant_admin", "regional_manager", "multisite_manager", "store_manager", "learner"]>;
    tenantId: z.ZodOptional<z.ZodString>;
    storeIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    regionIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    role: "kore_admin" | "tenant_admin" | "regional_manager" | "multisite_manager" | "store_manager" | "learner";
    tenantId?: string | undefined;
    storeIds?: string[] | undefined;
    regionIds?: string[] | undefined;
}, {
    name: string;
    email: string;
    password: string;
    role: "kore_admin" | "tenant_admin" | "regional_manager" | "multisite_manager" | "store_manager" | "learner";
    tenantId?: string | undefined;
    storeIds?: string[] | undefined;
    regionIds?: string[] | undefined;
}>;
export declare const userUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["kore_admin", "tenant_admin", "regional_manager", "multisite_manager", "store_manager", "learner"]>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    storeIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    regionIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    email?: string | undefined;
    role?: "kore_admin" | "tenant_admin" | "regional_manager" | "multisite_manager" | "store_manager" | "learner" | undefined;
    storeIds?: string[] | undefined;
    regionIds?: string[] | undefined;
    isActive?: boolean | undefined;
}, {
    name?: string | undefined;
    email?: string | undefined;
    role?: "kore_admin" | "tenant_admin" | "regional_manager" | "multisite_manager" | "store_manager" | "learner" | undefined;
    storeIds?: string[] | undefined;
    regionIds?: string[] | undefined;
    isActive?: boolean | undefined;
}>;
export declare const userStoreAssignSchema: z.ZodObject<{
    storeIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    storeIds: string[];
}, {
    storeIds: string[];
}>;
export declare const userRegionAssignSchema: z.ZodObject<{
    regionIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    regionIds: string[];
}, {
    regionIds: string[];
}>;
export declare const storeUserAssignSchema: z.ZodObject<{
    userIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    userIds: string[];
}, {
    userIds: string[];
}>;
export declare const auditCriterionSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    isRequired: z.ZodOptional<z.ZodBoolean>;
    photoRequired: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    sortOrder?: number | undefined;
    isRequired?: boolean | undefined;
    photoRequired?: boolean | undefined;
}, {
    name: string;
    description?: string | undefined;
    sortOrder?: number | undefined;
    isRequired?: boolean | undefined;
    photoRequired?: boolean | undefined;
}>;
export declare const auditCategorySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
    criteria: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodOptional<z.ZodNumber>;
        isRequired: z.ZodOptional<z.ZodBoolean>;
        photoRequired: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description?: string | undefined;
        sortOrder?: number | undefined;
        isRequired?: boolean | undefined;
        photoRequired?: boolean | undefined;
    }, {
        name: string;
        description?: string | undefined;
        sortOrder?: number | undefined;
        isRequired?: boolean | undefined;
        photoRequired?: boolean | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    sortOrder?: number | undefined;
    weight?: number | undefined;
    criteria?: {
        name: string;
        description?: string | undefined;
        sortOrder?: number | undefined;
        isRequired?: boolean | undefined;
        photoRequired?: boolean | undefined;
    }[] | undefined;
}, {
    name: string;
    description?: string | undefined;
    sortOrder?: number | undefined;
    weight?: number | undefined;
    criteria?: {
        name: string;
        description?: string | undefined;
        sortOrder?: number | undefined;
        isRequired?: boolean | undefined;
        photoRequired?: boolean | undefined;
    }[] | undefined;
}>;
export declare const auditTemplateCreateSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    categories: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
        criteria: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            sortOrder: z.ZodOptional<z.ZodNumber>;
            isRequired: z.ZodOptional<z.ZodBoolean>;
            photoRequired: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            description?: string | undefined;
            sortOrder?: number | undefined;
            isRequired?: boolean | undefined;
            photoRequired?: boolean | undefined;
        }, {
            name: string;
            description?: string | undefined;
            sortOrder?: number | undefined;
            isRequired?: boolean | undefined;
            photoRequired?: boolean | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description?: string | undefined;
        sortOrder?: number | undefined;
        weight?: number | undefined;
        criteria?: {
            name: string;
            description?: string | undefined;
            sortOrder?: number | undefined;
            isRequired?: boolean | undefined;
            photoRequired?: boolean | undefined;
        }[] | undefined;
    }, {
        name: string;
        description?: string | undefined;
        sortOrder?: number | undefined;
        weight?: number | undefined;
        criteria?: {
            name: string;
            description?: string | undefined;
            sortOrder?: number | undefined;
            isRequired?: boolean | undefined;
            photoRequired?: boolean | undefined;
        }[] | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    categories?: {
        name: string;
        description?: string | undefined;
        sortOrder?: number | undefined;
        weight?: number | undefined;
        criteria?: {
            name: string;
            description?: string | undefined;
            sortOrder?: number | undefined;
            isRequired?: boolean | undefined;
            photoRequired?: boolean | undefined;
        }[] | undefined;
    }[] | undefined;
}, {
    name: string;
    description?: string | undefined;
    categories?: {
        name: string;
        description?: string | undefined;
        sortOrder?: number | undefined;
        weight?: number | undefined;
        criteria?: {
            name: string;
            description?: string | undefined;
            sortOrder?: number | undefined;
            isRequired?: boolean | undefined;
            photoRequired?: boolean | undefined;
        }[] | undefined;
    }[] | undefined;
}>;
export declare const auditTemplateUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
}>;
export declare const auditSessionCreateSchema: z.ZodObject<{
    storeId: z.ZodString;
    templateId: z.ZodString;
    storeLocation: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    storeId: string;
    templateId: string;
    storeLocation?: string | undefined;
    notes?: string | undefined;
}, {
    storeId: string;
    templateId: string;
    storeLocation?: string | undefined;
    notes?: string | undefined;
}>;
export declare const auditResponseSchema: z.ZodObject<{
    scorePercent: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    passed: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    comment: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    scorePercent?: number | null | undefined;
    passed?: boolean | null | undefined;
    comment?: string | null | undefined;
}, {
    scorePercent?: number | null | undefined;
    passed?: boolean | null | undefined;
    comment?: string | null | undefined;
}>;
export type AuditRequestInput = z.infer<typeof auditRequestSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CourseCreateInput = z.infer<typeof courseCreateSchema>;
export type KPIEntryInput = z.infer<typeof kpiEntrySchema>;
export type TenantCreateInput = z.infer<typeof tenantCreateSchema>;
export type TenantUpdateInput = z.infer<typeof tenantUpdateSchema>;
export type StoreCreateInput = z.infer<typeof storeCreateSchema>;
export type StoreUpdateInput = z.infer<typeof storeUpdateSchema>;
export type StoreToolAssignInput = z.infer<typeof storeToolAssignSchema>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type UserStoreAssignInput = z.infer<typeof userStoreAssignSchema>;
export type StoreUserAssignInput = z.infer<typeof storeUserAssignSchema>;
export type AuditTemplateCreateInput = z.infer<typeof auditTemplateCreateSchema>;
export type AuditTemplateUpdateInput = z.infer<typeof auditTemplateUpdateSchema>;
export type AuditSessionCreateInput = z.infer<typeof auditSessionCreateSchema>;
export type AuditResponseInput = z.infer<typeof auditResponseSchema>;
//# sourceMappingURL=index.d.ts.map