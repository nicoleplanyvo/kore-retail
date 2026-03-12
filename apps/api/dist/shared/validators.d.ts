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
export declare const regionCreateSchema: z.ZodObject<{
    tenantId: z.ZodString;
    name: z.ZodString;
    description: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    tenantId: string;
    description?: string | undefined;
    sortOrder?: number | undefined;
}, {
    name: string;
    tenantId: string;
    description?: string | undefined;
    sortOrder?: number | undefined;
}>;
export declare const regionUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    sortOrder: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
}>;
export declare const regionStoreAssignSchema: z.ZodObject<{
    storeIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    storeIds: string[];
}, {
    storeIds: string[];
}>;
export declare const storeCreateSchema: z.ZodObject<{
    tenantId: z.ZodString;
    name: z.ZodString;
    city: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    address: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    regionId: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    tenantId: string;
    city?: string | undefined;
    address?: string | undefined;
    regionId?: string | undefined;
}, {
    name: string;
    tenantId: string;
    city?: string | undefined;
    address?: string | undefined;
    regionId?: string | undefined;
}>;
export declare const storeUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    address: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    regionId: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    city?: string | undefined;
    address?: string | undefined;
    regionId?: string | undefined;
}, {
    name?: string | undefined;
    city?: string | undefined;
    address?: string | undefined;
    regionId?: string | undefined;
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
    storeIds?: string[] | undefined;
    role?: "kore_admin" | "tenant_admin" | "regional_manager" | "multisite_manager" | "store_manager" | "learner" | undefined;
    regionIds?: string[] | undefined;
    isActive?: boolean | undefined;
}, {
    name?: string | undefined;
    email?: string | undefined;
    storeIds?: string[] | undefined;
    role?: "kore_admin" | "tenant_admin" | "regional_manager" | "multisite_manager" | "store_manager" | "learner" | undefined;
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
export type RegionCreateInput = z.infer<typeof regionCreateSchema>;
export type RegionUpdateInput = z.infer<typeof regionUpdateSchema>;
export type RegionStoreAssignInput = z.infer<typeof regionStoreAssignSchema>;
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
export declare const checklistTemplateCreateSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    sections: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        sortOrder: z.ZodDefault<z.ZodNumber>;
        items: z.ZodArray<z.ZodObject<{
            text: z.ZodString;
            type: z.ZodDefault<z.ZodEnum<["BOOLEAN", "TEXT", "NUMBER", "PHOTO"]>>;
            isRequired: z.ZodDefault<z.ZodBoolean>;
            sortOrder: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            type: "TEXT" | "BOOLEAN" | "NUMBER" | "PHOTO";
            sortOrder: number;
            isRequired: boolean;
            text: string;
        }, {
            text: string;
            type?: "TEXT" | "BOOLEAN" | "NUMBER" | "PHOTO" | undefined;
            sortOrder?: number | undefined;
            isRequired?: boolean | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        sortOrder: number;
        items: {
            type: "TEXT" | "BOOLEAN" | "NUMBER" | "PHOTO";
            sortOrder: number;
            isRequired: boolean;
            text: string;
        }[];
    }, {
        name: string;
        items: {
            text: string;
            type?: "TEXT" | "BOOLEAN" | "NUMBER" | "PHOTO" | undefined;
            sortOrder?: number | undefined;
            isRequired?: boolean | undefined;
        }[];
        sortOrder?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    sections: {
        name: string;
        sortOrder: number;
        items: {
            type: "TEXT" | "BOOLEAN" | "NUMBER" | "PHOTO";
            sortOrder: number;
            isRequired: boolean;
            text: string;
        }[];
    }[];
    description?: string | undefined;
}, {
    name: string;
    sections: {
        name: string;
        items: {
            text: string;
            type?: "TEXT" | "BOOLEAN" | "NUMBER" | "PHOTO" | undefined;
            sortOrder?: number | undefined;
            isRequired?: boolean | undefined;
        }[];
        sortOrder?: number | undefined;
    }[];
    description?: string | undefined;
}>;
export declare const checklistTemplateUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
}>;
export declare const checklistSessionCreateSchema: z.ZodObject<{
    storeId: z.ZodString;
    templateId: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    storeId: string;
    templateId: string;
    notes?: string | undefined;
}, {
    storeId: string;
    templateId: string;
    notes?: string | undefined;
}>;
export declare const checklistEntrySchema: z.ZodObject<{
    valueBool: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    valueText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    valueNumber: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    comment: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    comment?: string | null | undefined;
    valueBool?: boolean | null | undefined;
    valueText?: string | null | undefined;
    valueNumber?: number | null | undefined;
}, {
    comment?: string | null | undefined;
    valueBool?: boolean | null | undefined;
    valueText?: string | null | undefined;
    valueNumber?: number | null | undefined;
}>;
export declare const sopCategoryCreateSchema: z.ZodObject<{
    name: z.ZodString;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    sortOrder: number;
}, {
    name: string;
    sortOrder?: number | undefined;
}>;
export declare const sopCreateSchema: z.ZodObject<{
    categoryId: z.ZodString;
    title: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    categoryId: string;
}, {
    title: string;
    content: string;
    categoryId: string;
}>;
export declare const sopUpdateSchema: z.ZodObject<{
    categoryId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    content?: string | undefined;
    categoryId?: string | undefined;
}, {
    title?: string | undefined;
    content?: string | undefined;
    categoryId?: string | undefined;
}>;
export type ChecklistTemplateCreateInput = z.infer<typeof checklistTemplateCreateSchema>;
export type ChecklistTemplateUpdateInput = z.infer<typeof checklistTemplateUpdateSchema>;
export type ChecklistSessionCreateInput = z.infer<typeof checklistSessionCreateSchema>;
export type ChecklistEntryInput = z.infer<typeof checklistEntrySchema>;
export type SopCategoryCreateInput = z.infer<typeof sopCategoryCreateSchema>;
export type SopCreateInput = z.infer<typeof sopCreateSchema>;
export type SopUpdateInput = z.infer<typeof sopUpdateSchema>;
export declare const vmGuidelineCreateSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    category?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    category?: string | undefined;
}>;
export declare const vmGuidelineUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    isActive?: boolean | undefined;
    category?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    isActive?: boolean | undefined;
    category?: string | undefined;
}>;
export declare const vmSubmissionCreateSchema: z.ZodObject<{
    guidelineId: z.ZodString;
    storeId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    storeId: string;
    guidelineId: string;
}, {
    storeId: string;
    guidelineId: string;
}>;
export declare const vmReviewSchema: z.ZodObject<{
    status: z.ZodEnum<["APPROVED", "REJECTED"]>;
    reviewNote: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "APPROVED" | "REJECTED";
    reviewNote?: string | undefined;
}, {
    status: "APPROVED" | "REJECTED";
    reviewNote?: string | undefined;
}>;
export declare const standardCategoryCreateSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    sortOrder: number;
    description?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    sortOrder?: number | undefined;
}>;
export declare const standardCategoryUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    isActive?: boolean | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    isActive?: boolean | undefined;
}>;
export declare const standardDefinitionCreateSchema: z.ZodObject<{
    categoryId: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    unit: z.ZodOptional<z.ZodString>;
    targetValue: z.ZodNumber;
    operator: z.ZodDefault<z.ZodEnum<["GTE", "LTE", "EQ", "GT", "LT"]>>;
    weight: z.ZodDefault<z.ZodNumber>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    sortOrder: number;
    weight: number;
    categoryId: string;
    targetValue: number;
    operator: "GTE" | "LTE" | "EQ" | "GT" | "LT";
    description?: string | undefined;
    unit?: string | undefined;
}, {
    name: string;
    categoryId: string;
    targetValue: number;
    description?: string | undefined;
    sortOrder?: number | undefined;
    weight?: number | undefined;
    unit?: string | undefined;
    operator?: "GTE" | "LTE" | "EQ" | "GT" | "LT" | undefined;
}>;
export declare const standardDefinitionUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    unit: z.ZodOptional<z.ZodString>;
    targetValue: z.ZodOptional<z.ZodNumber>;
    operator: z.ZodOptional<z.ZodEnum<["GTE", "LTE", "EQ", "GT", "LT"]>>;
    weight: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    isActive?: boolean | undefined;
    weight?: number | undefined;
    unit?: string | undefined;
    targetValue?: number | undefined;
    operator?: "GTE" | "LTE" | "EQ" | "GT" | "LT" | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    isActive?: boolean | undefined;
    weight?: number | undefined;
    unit?: string | undefined;
    targetValue?: number | undefined;
    operator?: "GTE" | "LTE" | "EQ" | "GT" | "LT" | undefined;
}>;
export declare const standardEvaluationCreateSchema: z.ZodObject<{
    storeId: z.ZodString;
    period: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    storeId: string;
    period: string;
    notes?: string | undefined;
}, {
    storeId: string;
    period: string;
    notes?: string | undefined;
}>;
export declare const standardScoreSchema: z.ZodObject<{
    actualValue: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    actualValue: number;
    comment?: string | undefined;
}, {
    actualValue: number;
    comment?: string | undefined;
}>;
export type VmGuidelineCreateInput = z.infer<typeof vmGuidelineCreateSchema>;
export type VmGuidelineUpdateInput = z.infer<typeof vmGuidelineUpdateSchema>;
export type VmSubmissionCreateInput = z.infer<typeof vmSubmissionCreateSchema>;
export type VmReviewInput = z.infer<typeof vmReviewSchema>;
export type StandardCategoryCreateInput = z.infer<typeof standardCategoryCreateSchema>;
export type StandardCategoryUpdateInput = z.infer<typeof standardCategoryUpdateSchema>;
export type StandardDefinitionCreateInput = z.infer<typeof standardDefinitionCreateSchema>;
export type StandardDefinitionUpdateInput = z.infer<typeof standardDefinitionUpdateSchema>;
export type StandardEvaluationCreateInput = z.infer<typeof standardEvaluationCreateSchema>;
export type StandardScoreInput = z.infer<typeof standardScoreSchema>;
export declare const kpiEntryUpsertSchema: z.ZodObject<{
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
export declare const budgetPeriodCreateSchema: z.ZodObject<{
    storeId: z.ZodString;
    period: z.ZodString;
    budgetType: z.ZodDefault<z.ZodEnum<["MONTHLY", "QUARTERLY", "YEARLY"]>>;
    revenue: z.ZodDefault<z.ZodNumber>;
    cogs: z.ZodDefault<z.ZodNumber>;
    labor: z.ZodDefault<z.ZodNumber>;
    rent: z.ZodDefault<z.ZodNumber>;
    marketing: z.ZodDefault<z.ZodNumber>;
    other: z.ZodDefault<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    storeId: string;
    revenue: number;
    period: string;
    budgetType: "MONTHLY" | "QUARTERLY" | "YEARLY";
    cogs: number;
    labor: number;
    rent: number;
    marketing: number;
    other: number;
    notes?: string | undefined;
}, {
    storeId: string;
    period: string;
    revenue?: number | undefined;
    notes?: string | undefined;
    budgetType?: "MONTHLY" | "QUARTERLY" | "YEARLY" | undefined;
    cogs?: number | undefined;
    labor?: number | undefined;
    rent?: number | undefined;
    marketing?: number | undefined;
    other?: number | undefined;
}>;
export declare const budgetPeriodUpdateSchema: z.ZodObject<{
    revenue: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    cogs: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    labor: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    rent: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    marketing: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    other: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    revenue?: number | undefined;
    notes?: string | undefined;
    cogs?: number | undefined;
    labor?: number | undefined;
    rent?: number | undefined;
    marketing?: number | undefined;
    other?: number | undefined;
}, {
    revenue?: number | undefined;
    notes?: string | undefined;
    cogs?: number | undefined;
    labor?: number | undefined;
    rent?: number | undefined;
    marketing?: number | undefined;
    other?: number | undefined;
}>;
export declare const budgetActualCreateSchema: z.ZodObject<{
    category: z.ZodEnum<["REVENUE", "COGS", "LABOR", "RENT", "MARKETING", "OTHER"]>;
    actualAmount: z.ZodNumber;
    date: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date: string;
    category: "REVENUE" | "COGS" | "LABOR" | "RENT" | "MARKETING" | "OTHER";
    actualAmount: number;
    description?: string | undefined;
}, {
    date: string;
    category: "REVENUE" | "COGS" | "LABOR" | "RENT" | "MARKETING" | "OTHER";
    actualAmount: number;
    description?: string | undefined;
}>;
export declare const forecastCreateSchema: z.ZodObject<{
    storeId: z.ZodString;
    period: z.ZodString;
    forecastType: z.ZodDefault<z.ZodEnum<["REVENUE", "TRANSACTIONS", "FOOTFALL"]>>;
    forecastValue: z.ZodNumber;
    confidence: z.ZodOptional<z.ZodNumber>;
    method: z.ZodDefault<z.ZodEnum<["MANUAL", "TREND", "AI"]>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    storeId: string;
    period: string;
    forecastType: "REVENUE" | "TRANSACTIONS" | "FOOTFALL";
    forecastValue: number;
    method: "MANUAL" | "TREND" | "AI";
    notes?: string | undefined;
    confidence?: number | undefined;
}, {
    storeId: string;
    period: string;
    forecastValue: number;
    notes?: string | undefined;
    forecastType?: "REVENUE" | "TRANSACTIONS" | "FOOTFALL" | undefined;
    confidence?: number | undefined;
    method?: "MANUAL" | "TREND" | "AI" | undefined;
}>;
export declare const forecastUpdateSchema: z.ZodObject<{
    forecastValue: z.ZodOptional<z.ZodNumber>;
    actualValue: z.ZodOptional<z.ZodNumber>;
    confidence: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    notes?: string | undefined;
    actualValue?: number | undefined;
    forecastValue?: number | undefined;
    confidence?: number | undefined;
}, {
    notes?: string | undefined;
    actualValue?: number | undefined;
    forecastValue?: number | undefined;
    confidence?: number | undefined;
}>;
export declare const lossIncidentCreateSchema: z.ZodObject<{
    storeId: z.ZodString;
    incidentDate: z.ZodString;
    category: z.ZodEnum<["THEFT", "DAMAGE", "ADMIN_ERROR", "SUPPLIER", "OTHER"]>;
    amount: z.ZodNumber;
    description: z.ZodString;
    severity: z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "CRITICAL"]>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    storeId: string;
    category: "OTHER" | "THEFT" | "DAMAGE" | "ADMIN_ERROR" | "SUPPLIER";
    incidentDate: string;
    amount: number;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}, {
    description: string;
    storeId: string;
    category: "OTHER" | "THEFT" | "DAMAGE" | "ADMIN_ERROR" | "SUPPLIER";
    incidentDate: string;
    amount: number;
    severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
}>;
export declare const lossIncidentUpdateSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["OPEN", "INVESTIGATING", "RESOLVED", "CLOSED"]>>;
    severity: z.ZodOptional<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "CRITICAL"]>>;
    resolution: z.ZodOptional<z.ZodString>;
    assignedTo: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "OPEN" | "INVESTIGATING" | "RESOLVED" | "CLOSED" | undefined;
    severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
    resolution?: string | undefined;
    assignedTo?: string | undefined;
}, {
    status?: "OPEN" | "INVESTIGATING" | "RESOLVED" | "CLOSED" | undefined;
    severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | undefined;
    resolution?: string | undefined;
    assignedTo?: string | undefined;
}>;
export declare const inventoryCountCreateSchema: z.ZodObject<{
    storeId: z.ZodString;
    countDate: z.ZodString;
    countType: z.ZodDefault<z.ZodEnum<["FULL", "PARTIAL", "CYCLE"]>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    storeId: string;
    countDate: string;
    countType: "FULL" | "PARTIAL" | "CYCLE";
    notes?: string | undefined;
}, {
    storeId: string;
    countDate: string;
    notes?: string | undefined;
    countType?: "FULL" | "PARTIAL" | "CYCLE" | undefined;
}>;
export declare const inventoryItemUpsertSchema: z.ZodObject<{
    sku: z.ZodString;
    productName: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
    expectedQty: z.ZodNumber;
    actualQty: z.ZodNumber;
    unitPrice: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sku: string;
    productName: string;
    expectedQty: number;
    actualQty: number;
    unitPrice: number;
    notes?: string | undefined;
    category?: string | undefined;
}, {
    sku: string;
    productName: string;
    expectedQty: number;
    actualQty: number;
    unitPrice: number;
    notes?: string | undefined;
    category?: string | undefined;
}>;
export type KpiEntryUpsertInput = z.infer<typeof kpiEntryUpsertSchema>;
export type BudgetPeriodCreateInput = z.infer<typeof budgetPeriodCreateSchema>;
export type BudgetPeriodUpdateInput = z.infer<typeof budgetPeriodUpdateSchema>;
export type BudgetActualCreateInput = z.infer<typeof budgetActualCreateSchema>;
export type ForecastCreateInput = z.infer<typeof forecastCreateSchema>;
export type ForecastUpdateInput = z.infer<typeof forecastUpdateSchema>;
export type LossIncidentCreateInput = z.infer<typeof lossIncidentCreateSchema>;
export type LossIncidentUpdateInput = z.infer<typeof lossIncidentUpdateSchema>;
export type InventoryCountCreateInput = z.infer<typeof inventoryCountCreateSchema>;
export type InventoryItemUpsertInput = z.infer<typeof inventoryItemUpsertSchema>;
export declare const floorZoneCreateSchema: z.ZodObject<{
    storeId: z.ZodString;
    name: z.ZodString;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    storeId: string;
    sortOrder: number;
}, {
    name: string;
    storeId: string;
    sortOrder?: number | undefined;
}>;
export declare const floorZoneUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    sortOrder?: number | undefined;
    isActive?: boolean | undefined;
}, {
    name?: string | undefined;
    sortOrder?: number | undefined;
    isActive?: boolean | undefined;
}>;
export declare const floorPositionCreateSchema: z.ZodObject<{
    storeId: z.ZodString;
    zoneId: z.ZodOptional<z.ZodString>;
    userId: z.ZodString;
    userName: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["ON_FLOOR", "ON_BREAK", "OFF_FLOOR", "CASHIER"]>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "ON_FLOOR" | "ON_BREAK" | "OFF_FLOOR" | "CASHIER";
    storeId: string;
    userId: string;
    userName: string;
    notes?: string | undefined;
    zoneId?: string | undefined;
}, {
    storeId: string;
    userId: string;
    userName: string;
    status?: "ON_FLOOR" | "ON_BREAK" | "OFF_FLOOR" | "CASHIER" | undefined;
    notes?: string | undefined;
    zoneId?: string | undefined;
}>;
export declare const floorPositionUpdateSchema: z.ZodObject<{
    zoneId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<["ON_FLOOR", "ON_BREAK", "OFF_FLOOR", "CASHIER"]>>;
    notes: z.ZodOptional<z.ZodString>;
    endedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "ON_FLOOR" | "ON_BREAK" | "OFF_FLOOR" | "CASHIER" | undefined;
    notes?: string | undefined;
    zoneId?: string | null | undefined;
    endedAt?: string | undefined;
}, {
    status?: "ON_FLOOR" | "ON_BREAK" | "OFF_FLOOR" | "CASHIER" | undefined;
    notes?: string | undefined;
    zoneId?: string | null | undefined;
    endedAt?: string | undefined;
}>;
export declare const footfallUpsertSchema: z.ZodObject<{
    storeId: z.ZodString;
    date: z.ZodString;
    hour: z.ZodOptional<z.ZodNumber>;
    footfall: z.ZodNumber;
    revenue: z.ZodOptional<z.ZodNumber>;
    transactions: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    date: string;
    storeId: string;
    footfall: number;
    revenue?: number | undefined;
    transactions?: number | undefined;
    hour?: number | undefined;
}, {
    date: string;
    storeId: string;
    footfall: number;
    revenue?: number | undefined;
    transactions?: number | undefined;
    hour?: number | undefined;
}>;
export declare const vmGuidelineDocCreateSchema: z.ZodObject<{
    title: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    effectiveFrom: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    category?: string | undefined;
    effectiveFrom?: string | undefined;
}, {
    title: string;
    content: string;
    category?: string | undefined;
    effectiveFrom?: string | undefined;
}>;
export declare const vmGuidelineDocUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    effectiveFrom: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    content?: string | undefined;
    category?: string | undefined;
    effectiveFrom?: string | undefined;
}, {
    title?: string | undefined;
    content?: string | undefined;
    category?: string | undefined;
    effectiveFrom?: string | undefined;
}>;
export declare const maintenanceRequestCreateSchema: z.ZodObject<{
    storeId: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    category: z.ZodEnum<["ELECTRICAL", "PLUMBING", "HVAC", "FIXTURE", "IT", "OTHER"]>;
    priority: z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "URGENT"]>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    storeId: string;
    category: "OTHER" | "ELECTRICAL" | "PLUMBING" | "HVAC" | "FIXTURE" | "IT";
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}, {
    title: string;
    description: string;
    storeId: string;
    category: "OTHER" | "ELECTRICAL" | "PLUMBING" | "HVAC" | "FIXTURE" | "IT";
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
}>;
export declare const maintenanceRequestUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<["ELECTRICAL", "PLUMBING", "HVAC", "FIXTURE", "IT", "OTHER"]>>;
    priority: z.ZodOptional<z.ZodEnum<["LOW", "MEDIUM", "HIGH", "URGENT"]>>;
    status: z.ZodOptional<z.ZodEnum<["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]>>;
    assignedTo: z.ZodOptional<z.ZodString>;
    estimatedCost: z.ZodOptional<z.ZodNumber>;
    actualCost: z.ZodOptional<z.ZodNumber>;
    resolution: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "OPEN" | "RESOLVED" | "CLOSED" | "IN_PROGRESS" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    category?: "OTHER" | "ELECTRICAL" | "PLUMBING" | "HVAC" | "FIXTURE" | "IT" | undefined;
    resolution?: string | undefined;
    assignedTo?: string | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
    estimatedCost?: number | undefined;
    actualCost?: number | undefined;
}, {
    status?: "OPEN" | "RESOLVED" | "CLOSED" | "IN_PROGRESS" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    category?: "OTHER" | "ELECTRICAL" | "PLUMBING" | "HVAC" | "FIXTURE" | "IT" | undefined;
    resolution?: string | undefined;
    assignedTo?: string | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | undefined;
    estimatedCost?: number | undefined;
    actualCost?: number | undefined;
}>;
export type FloorZoneCreateInput = z.infer<typeof floorZoneCreateSchema>;
export type FloorZoneUpdateInput = z.infer<typeof floorZoneUpdateSchema>;
export type FloorPositionCreateInput = z.infer<typeof floorPositionCreateSchema>;
export type FloorPositionUpdateInput = z.infer<typeof floorPositionUpdateSchema>;
export type FootfallUpsertInput = z.infer<typeof footfallUpsertSchema>;
export type VmGuidelineDocCreateInput = z.infer<typeof vmGuidelineDocCreateSchema>;
export type VmGuidelineDocUpdateInput = z.infer<typeof vmGuidelineDocUpdateSchema>;
export type MaintenanceRequestCreateInput = z.infer<typeof maintenanceRequestCreateSchema>;
export type MaintenanceRequestUpdateInput = z.infer<typeof maintenanceRequestUpdateSchema>;
//# sourceMappingURL=validators.d.ts.map