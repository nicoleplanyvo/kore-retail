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
export declare const legacyCourseCreateSchema: z.ZodObject<{
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
export type LegacyCourseCreateInput = z.infer<typeof legacyCourseCreateSchema>;
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
    deadline: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isMandatory: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    categoryId: string;
    deadline?: string | null | undefined;
    isMandatory?: boolean | undefined;
}, {
    title: string;
    content: string;
    categoryId: string;
    deadline?: string | null | undefined;
    isMandatory?: boolean | undefined;
}>;
export declare const sopUpdateSchema: z.ZodObject<{
    categoryId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    deadline: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isMandatory: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    content?: string | undefined;
    categoryId?: string | undefined;
    deadline?: string | null | undefined;
    isMandatory?: boolean | undefined;
}, {
    title?: string | undefined;
    content?: string | undefined;
    categoryId?: string | undefined;
    deadline?: string | null | undefined;
    isMandatory?: boolean | undefined;
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
    areaId: z.ZodOptional<z.ZodString>;
    deadline: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    storeId: string;
    guidelineId: string;
    deadline?: string | undefined;
    areaId?: string | undefined;
}, {
    storeId: string;
    guidelineId: string;
    deadline?: string | undefined;
    areaId?: string | undefined;
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
export declare const vmAreaCreateSchema: z.ZodObject<{
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
export declare const vmAreaUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
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
export type VmAreaCreateInput = z.infer<typeof vmAreaCreateSchema>;
export type VmAreaUpdateInput = z.infer<typeof vmAreaUpdateSchema>;
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
    description: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
    minStaff: z.ZodDefault<z.ZodNumber>;
    maxStaff: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    storeId: string;
    sortOrder: number;
    minStaff: number;
    maxStaff: number;
    description?: string | undefined;
}, {
    name: string;
    storeId: string;
    description?: string | undefined;
    sortOrder?: number | undefined;
    minStaff?: number | undefined;
    maxStaff?: number | undefined;
}>;
export declare const floorZoneUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    minStaff: z.ZodOptional<z.ZodNumber>;
    maxStaff: z.ZodOptional<z.ZodNumber>;
    customerCount: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    isActive?: boolean | undefined;
    minStaff?: number | undefined;
    maxStaff?: number | undefined;
    customerCount?: number | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    isActive?: boolean | undefined;
    minStaff?: number | undefined;
    maxStaff?: number | undefined;
    customerCount?: number | undefined;
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
export declare const floorFrequencyUpdateSchema: z.ZodObject<{
    customerCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    customerCount: number;
}, {
    customerCount: number;
}>;
export declare const floorBulkAssignSchema: z.ZodObject<{
    assignments: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        userName: z.ZodString;
        zoneId: z.ZodNullable<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["ON_FLOOR", "ON_BREAK", "OFF_FLOOR", "CASHIER"]>>;
    }, "strip", z.ZodTypeAny, {
        status: "ON_FLOOR" | "ON_BREAK" | "OFF_FLOOR" | "CASHIER";
        zoneId: string | null;
        userId: string;
        userName: string;
    }, {
        zoneId: string | null;
        userId: string;
        userName: string;
        status?: "ON_FLOOR" | "ON_BREAK" | "OFF_FLOOR" | "CASHIER" | undefined;
    }>, "many">;
    storeId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    storeId: string;
    assignments: {
        status: "ON_FLOOR" | "ON_BREAK" | "OFF_FLOOR" | "CASHIER";
        zoneId: string | null;
        userId: string;
        userName: string;
    }[];
}, {
    storeId: string;
    assignments: {
        zoneId: string | null;
        userId: string;
        userName: string;
        status?: "ON_FLOOR" | "ON_BREAK" | "OFF_FLOOR" | "CASHIER" | undefined;
    }[];
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
export type FloorFrequencyUpdateInput = z.infer<typeof floorFrequencyUpdateSchema>;
export type FloorBulkAssignInput = z.infer<typeof floorBulkAssignSchema>;
export declare const courseCreateSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    durationMinutes: z.ZodDefault<z.ZodNumber>;
    isRequired: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title: string;
    isRequired: boolean;
    durationMinutes: number;
    description?: string | undefined;
    category?: string | undefined;
}, {
    title: string;
    description?: string | undefined;
    isRequired?: boolean | undefined;
    category?: string | undefined;
    durationMinutes?: number | undefined;
}>;
export declare const courseUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    durationMinutes: z.ZodOptional<z.ZodNumber>;
    isRequired: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "PUBLISHED", "ARCHIVED"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    isRequired?: boolean | undefined;
    category?: string | undefined;
    durationMinutes?: number | undefined;
}, {
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    isRequired?: boolean | undefined;
    category?: string | undefined;
    durationMinutes?: number | undefined;
}>;
export declare const courseModuleCreateSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
    durationMinutes: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    title: string;
    sortOrder: number;
    durationMinutes: number;
    content?: string | undefined;
}, {
    title: string;
    content?: string | undefined;
    sortOrder?: number | undefined;
    durationMinutes?: number | undefined;
}>;
export declare const enrollmentCreateSchema: z.ZodObject<{
    courseId: z.ZodString;
    userId: z.ZodString;
    storeId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    storeId: string;
    userId: string;
    courseId: string;
}, {
    storeId: string;
    userId: string;
    courseId: string;
}>;
export declare const enrollmentProgressSchema: z.ZodObject<{
    progress: z.ZodNumber;
    status: z.ZodOptional<z.ZodEnum<["ENROLLED", "IN_PROGRESS", "COMPLETED"]>>;
}, "strip", z.ZodTypeAny, {
    progress: number;
    status?: "IN_PROGRESS" | "ENROLLED" | "COMPLETED" | undefined;
}, {
    progress: number;
    status?: "IN_PROGRESS" | "ENROLLED" | "COMPLETED" | undefined;
}>;
export declare const trainingLogCreateSchema: z.ZodObject<{
    storeId: z.ZodString;
    userId: z.ZodString;
    date: z.ZodString;
    durationMinutes: z.ZodNumber;
    category: z.ZodDefault<z.ZodEnum<["PRODUCT", "SALES", "SERVICE", "COMPLIANCE", "ONBOARDING", "OTHER"]>>;
    topic: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date: string;
    storeId: string;
    category: "OTHER" | "PRODUCT" | "SALES" | "SERVICE" | "COMPLIANCE" | "ONBOARDING";
    userId: string;
    durationMinutes: number;
    notes?: string | undefined;
    topic?: string | undefined;
}, {
    date: string;
    storeId: string;
    userId: string;
    durationMinutes: number;
    notes?: string | undefined;
    category?: "OTHER" | "PRODUCT" | "SALES" | "SERVICE" | "COMPLIANCE" | "ONBOARDING" | undefined;
    topic?: string | undefined;
}>;
export declare const trainingLogUpdateSchema: z.ZodObject<{
    durationMinutes: z.ZodOptional<z.ZodNumber>;
    category: z.ZodOptional<z.ZodEnum<["PRODUCT", "SALES", "SERVICE", "COMPLIANCE", "ONBOARDING", "OTHER"]>>;
    topic: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    verifiedBy: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    notes?: string | undefined;
    category?: "OTHER" | "PRODUCT" | "SALES" | "SERVICE" | "COMPLIANCE" | "ONBOARDING" | undefined;
    durationMinutes?: number | undefined;
    topic?: string | undefined;
    verifiedBy?: string | undefined;
}, {
    notes?: string | undefined;
    category?: "OTHER" | "PRODUCT" | "SALES" | "SERVICE" | "COMPLIANCE" | "ONBOARDING" | undefined;
    durationMinutes?: number | undefined;
    topic?: string | undefined;
    verifiedBy?: string | undefined;
}>;
export declare const challengeCreateSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mode: z.ZodDefault<z.ZodEnum<["KPI", "VOTING"]>>;
    type: z.ZodDefault<z.ZodEnum<["INDIVIDUAL", "TEAM", "STORE"]>>;
    metric: z.ZodOptional<z.ZodString>;
    targetValue: z.ZodOptional<z.ZodNumber>;
    startDate: z.ZodString;
    endDate: z.ZodString;
    recurring: z.ZodOptional<z.ZodEnum<["NONE", "WEEKLY", "MONTHLY", "QUARTERLY"]>>;
    reward: z.ZodOptional<z.ZodString>;
    rewardType: z.ZodOptional<z.ZodEnum<["HONOUR", "PRIZE", "POINTS", "BADGE"]>>;
    anonymized: z.ZodOptional<z.ZodBoolean>;
    storeIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "INDIVIDUAL" | "TEAM" | "STORE";
    title: string;
    mode: "KPI" | "VOTING";
    startDate: string;
    endDate: string;
    description?: string | undefined;
    storeIds?: string[] | undefined;
    targetValue?: number | undefined;
    metric?: string | undefined;
    recurring?: "MONTHLY" | "QUARTERLY" | "NONE" | "WEEKLY" | undefined;
    reward?: string | undefined;
    rewardType?: "HONOUR" | "PRIZE" | "POINTS" | "BADGE" | undefined;
    anonymized?: boolean | undefined;
}, {
    title: string;
    startDate: string;
    endDate: string;
    type?: "INDIVIDUAL" | "TEAM" | "STORE" | undefined;
    description?: string | undefined;
    storeIds?: string[] | undefined;
    targetValue?: number | undefined;
    mode?: "KPI" | "VOTING" | undefined;
    metric?: string | undefined;
    recurring?: "MONTHLY" | "QUARTERLY" | "NONE" | "WEEKLY" | undefined;
    reward?: string | undefined;
    rewardType?: "HONOUR" | "PRIZE" | "POINTS" | "BADGE" | undefined;
    anonymized?: boolean | undefined;
}>;
export declare const challengeUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "ACTIVE", "COMPLETED", "CANCELLED"]>>;
    targetValue: z.ZodOptional<z.ZodNumber>;
    reward: z.ZodOptional<z.ZodString>;
    rewardType: z.ZodOptional<z.ZodEnum<["HONOUR", "PRIZE", "POINTS", "BADGE"]>>;
    anonymized: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    status?: "DRAFT" | "COMPLETED" | "ACTIVE" | "CANCELLED" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    targetValue?: number | undefined;
    reward?: string | undefined;
    rewardType?: "HONOUR" | "PRIZE" | "POINTS" | "BADGE" | undefined;
    anonymized?: boolean | undefined;
}, {
    status?: "DRAFT" | "COMPLETED" | "ACTIVE" | "CANCELLED" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    targetValue?: number | undefined;
    reward?: string | undefined;
    rewardType?: "HONOUR" | "PRIZE" | "POINTS" | "BADGE" | undefined;
    anonymized?: boolean | undefined;
}>;
export declare const challengeEntrySchema: z.ZodObject<{
    value: z.ZodNumber;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    value: number;
    note?: string | undefined;
}, {
    value: number;
    note?: string | undefined;
}>;
export declare const challengeVoteSchema: z.ZodObject<{
    targetUserId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    targetUserId: string;
}, {
    targetUserId: string;
}>;
export declare const challengeProgressSchema: z.ZodObject<{
    currentValue: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    currentValue: number;
}, {
    currentValue: number;
}>;
export declare const onboardingTemplateCreateSchema: z.ZodObject<{
    name: z.ZodString;
    role: z.ZodOptional<z.ZodString>;
    durationDays: z.ZodDefault<z.ZodNumber>;
    isDefault: z.ZodDefault<z.ZodBoolean>;
    steps: z.ZodOptional<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        dayNumber: z.ZodDefault<z.ZodNumber>;
        sortOrder: z.ZodDefault<z.ZodNumber>;
        isRequired: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        sortOrder: number;
        isRequired: boolean;
        dayNumber: number;
        description?: string | undefined;
        category?: string | undefined;
    }, {
        title: string;
        description?: string | undefined;
        sortOrder?: number | undefined;
        isRequired?: boolean | undefined;
        category?: string | undefined;
        dayNumber?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    durationDays: number;
    isDefault: boolean;
    role?: string | undefined;
    steps?: {
        title: string;
        sortOrder: number;
        isRequired: boolean;
        dayNumber: number;
        description?: string | undefined;
        category?: string | undefined;
    }[] | undefined;
}, {
    name: string;
    role?: string | undefined;
    durationDays?: number | undefined;
    isDefault?: boolean | undefined;
    steps?: {
        title: string;
        description?: string | undefined;
        sortOrder?: number | undefined;
        isRequired?: boolean | undefined;
        category?: string | undefined;
        dayNumber?: number | undefined;
    }[] | undefined;
}>;
export declare const onboardingJourneyCreateSchema: z.ZodObject<{
    templateId: z.ZodString;
    storeId: z.ZodString;
    userId: z.ZodString;
    mentorId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodString;
}, "strip", z.ZodTypeAny, {
    storeId: string;
    templateId: string;
    userId: string;
    startDate: string;
    mentorId?: string | undefined;
}, {
    storeId: string;
    templateId: string;
    userId: string;
    startDate: string;
    mentorId?: string | undefined;
}>;
export declare const onboardingStepUpdateSchema: z.ZodObject<{
    status: z.ZodEnum<["PENDING", "IN_PROGRESS", "COMPLETED", "SKIPPED"]>;
    notes: z.ZodOptional<z.ZodString>;
    verifiedBy: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "IN_PROGRESS" | "COMPLETED" | "PENDING" | "SKIPPED";
    notes?: string | undefined;
    verifiedBy?: string | undefined;
}, {
    status: "IN_PROGRESS" | "COMPLETED" | "PENDING" | "SKIPPED";
    notes?: string | undefined;
    verifiedBy?: string | undefined;
}>;
export type CourseCreateInput2 = z.infer<typeof courseCreateSchema>;
export type CourseUpdateInput = z.infer<typeof courseUpdateSchema>;
export type CourseModuleCreateInput = z.infer<typeof courseModuleCreateSchema>;
export type EnrollmentCreateInput = z.infer<typeof enrollmentCreateSchema>;
export type EnrollmentProgressInput = z.infer<typeof enrollmentProgressSchema>;
export type TrainingLogCreateInput = z.infer<typeof trainingLogCreateSchema>;
export type TrainingLogUpdateInput = z.infer<typeof trainingLogUpdateSchema>;
export type ChallengeCreateInput = z.infer<typeof challengeCreateSchema>;
export type ChallengeUpdateInput = z.infer<typeof challengeUpdateSchema>;
export type ChallengeProgressInput = z.infer<typeof challengeProgressSchema>;
export type ChallengeEntryInput = z.infer<typeof challengeEntrySchema>;
export type ChallengeVoteInput = z.infer<typeof challengeVoteSchema>;
export type OnboardingTemplateCreateInput = z.infer<typeof onboardingTemplateCreateSchema>;
export type OnboardingJourneyCreateInput = z.infer<typeof onboardingJourneyCreateSchema>;
export type OnboardingStepUpdateInput = z.infer<typeof onboardingStepUpdateSchema>;
export declare const coachingSessionCreateSchema: z.ZodObject<{
    storeId: z.ZodString;
    coacheeId: z.ZodString;
    scheduledAt: z.ZodString;
    duration: z.ZodDefault<z.ZodNumber>;
    type: z.ZodDefault<z.ZodEnum<["REGULAR", "AD_HOC", "FOLLOW_UP"]>>;
    framework: z.ZodDefault<z.ZodEnum<["GROW", "SMART", "FREE"]>>;
    topic: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    goalText: z.ZodOptional<z.ZodString>;
    realityText: z.ZodOptional<z.ZodString>;
    optionsText: z.ZodOptional<z.ZodString>;
    wayForwardText: z.ZodOptional<z.ZodString>;
    timelineText: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    actionItems: z.ZodOptional<z.ZodString>;
    mood: z.ZodOptional<z.ZodNumber>;
    followUpDate: z.ZodOptional<z.ZodString>;
    templateId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "REGULAR" | "AD_HOC" | "FOLLOW_UP";
    storeId: string;
    coacheeId: string;
    scheduledAt: string;
    duration: number;
    framework: "GROW" | "SMART" | "FREE";
    templateId?: string | undefined;
    notes?: string | undefined;
    category?: string | undefined;
    topic?: string | undefined;
    goalText?: string | undefined;
    realityText?: string | undefined;
    optionsText?: string | undefined;
    wayForwardText?: string | undefined;
    timelineText?: string | undefined;
    actionItems?: string | undefined;
    mood?: number | undefined;
    followUpDate?: string | undefined;
}, {
    storeId: string;
    coacheeId: string;
    scheduledAt: string;
    type?: "REGULAR" | "AD_HOC" | "FOLLOW_UP" | undefined;
    templateId?: string | undefined;
    notes?: string | undefined;
    category?: string | undefined;
    topic?: string | undefined;
    duration?: number | undefined;
    framework?: "GROW" | "SMART" | "FREE" | undefined;
    goalText?: string | undefined;
    realityText?: string | undefined;
    optionsText?: string | undefined;
    wayForwardText?: string | undefined;
    timelineText?: string | undefined;
    actionItems?: string | undefined;
    mood?: number | undefined;
    followUpDate?: string | undefined;
}>;
export declare const coachingSessionUpdateSchema: z.ZodObject<{
    scheduledAt: z.ZodOptional<z.ZodString>;
    duration: z.ZodOptional<z.ZodNumber>;
    type: z.ZodOptional<z.ZodEnum<["REGULAR", "AD_HOC", "FOLLOW_UP"]>>;
    status: z.ZodOptional<z.ZodEnum<["SCHEDULED", "COMPLETED", "CANCELLED"]>>;
    framework: z.ZodOptional<z.ZodEnum<["GROW", "SMART", "FREE"]>>;
    topic: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    goalText: z.ZodOptional<z.ZodString>;
    realityText: z.ZodOptional<z.ZodString>;
    optionsText: z.ZodOptional<z.ZodString>;
    wayForwardText: z.ZodOptional<z.ZodString>;
    timelineText: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    actionItems: z.ZodOptional<z.ZodString>;
    mood: z.ZodOptional<z.ZodNumber>;
    followUpDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type?: "REGULAR" | "AD_HOC" | "FOLLOW_UP" | undefined;
    status?: "COMPLETED" | "CANCELLED" | "SCHEDULED" | undefined;
    notes?: string | undefined;
    category?: string | undefined;
    topic?: string | undefined;
    scheduledAt?: string | undefined;
    duration?: number | undefined;
    framework?: "GROW" | "SMART" | "FREE" | undefined;
    goalText?: string | undefined;
    realityText?: string | undefined;
    optionsText?: string | undefined;
    wayForwardText?: string | undefined;
    timelineText?: string | undefined;
    actionItems?: string | undefined;
    mood?: number | undefined;
    followUpDate?: string | undefined;
}, {
    type?: "REGULAR" | "AD_HOC" | "FOLLOW_UP" | undefined;
    status?: "COMPLETED" | "CANCELLED" | "SCHEDULED" | undefined;
    notes?: string | undefined;
    category?: string | undefined;
    topic?: string | undefined;
    scheduledAt?: string | undefined;
    duration?: number | undefined;
    framework?: "GROW" | "SMART" | "FREE" | undefined;
    goalText?: string | undefined;
    realityText?: string | undefined;
    optionsText?: string | undefined;
    wayForwardText?: string | undefined;
    timelineText?: string | undefined;
    actionItems?: string | undefined;
    mood?: number | undefined;
    followUpDate?: string | undefined;
}>;
export declare const coachingTemplateCreateSchema: z.ZodObject<{
    name: z.ZodString;
    framework: z.ZodDefault<z.ZodEnum<["GROW", "SMART", "FREE"]>>;
    topic: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    goalText: z.ZodOptional<z.ZodString>;
    realityText: z.ZodOptional<z.ZodString>;
    optionsText: z.ZodOptional<z.ZodString>;
    wayForwardText: z.ZodOptional<z.ZodString>;
    timelineText: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    framework: "GROW" | "SMART" | "FREE";
    notes?: string | undefined;
    category?: string | undefined;
    topic?: string | undefined;
    goalText?: string | undefined;
    realityText?: string | undefined;
    optionsText?: string | undefined;
    wayForwardText?: string | undefined;
    timelineText?: string | undefined;
}, {
    name: string;
    notes?: string | undefined;
    category?: string | undefined;
    topic?: string | undefined;
    framework?: "GROW" | "SMART" | "FREE" | undefined;
    goalText?: string | undefined;
    realityText?: string | undefined;
    optionsText?: string | undefined;
    wayForwardText?: string | undefined;
    timelineText?: string | undefined;
}>;
export declare const developmentPlanCreateSchema: z.ZodObject<{
    storeId: z.ZodOptional<z.ZodString>;
    userId: z.ZodString;
    type: z.ZodEnum<["PDP", "PIP"]>;
    title: z.ZodString;
    targetDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "PDP" | "PIP";
    title: string;
    userId: string;
    storeId?: string | undefined;
    targetDate?: string | undefined;
}, {
    type: "PDP" | "PIP";
    title: string;
    userId: string;
    storeId?: string | undefined;
    targetDate?: string | undefined;
}>;
export declare const developmentGoalCreateSchema: z.ZodObject<{
    title: z.ZodString;
    measureOfSuccess: z.ZodOptional<z.ZodString>;
    targetDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    targetDate?: string | undefined;
    measureOfSuccess?: string | undefined;
}, {
    title: string;
    targetDate?: string | undefined;
    measureOfSuccess?: string | undefined;
}>;
export declare const developmentGoalUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    measureOfSuccess: z.ZodOptional<z.ZodString>;
    targetDate: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]>>;
    progress: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status?: "IN_PROGRESS" | "COMPLETED" | "NOT_STARTED" | undefined;
    title?: string | undefined;
    progress?: number | undefined;
    targetDate?: string | undefined;
    measureOfSuccess?: string | undefined;
}, {
    status?: "IN_PROGRESS" | "COMPLETED" | "NOT_STARTED" | undefined;
    title?: string | undefined;
    progress?: number | undefined;
    targetDate?: string | undefined;
    measureOfSuccess?: string | undefined;
}>;
export declare const developmentReviewCreateSchema: z.ZodObject<{
    overallProgress: z.ZodDefault<z.ZodNumber>;
    comments: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    overallProgress: number;
    comments?: string | undefined;
}, {
    overallProgress?: number | undefined;
    comments?: string | undefined;
}>;
export declare const appraisalCycleCreateSchema: z.ZodObject<{
    name: z.ZodString;
    period: z.ZodOptional<z.ZodString>;
    startDate: z.ZodString;
    endDate: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    startDate: string;
    endDate: string;
    period?: string | undefined;
}, {
    name: string;
    startDate: string;
    endDate: string;
    period?: string | undefined;
}>;
export declare const appraisalCreateSchema: z.ZodObject<{
    cycleId: z.ZodString;
    storeId: z.ZodOptional<z.ZodString>;
    employeeId: z.ZodString;
    managerId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    cycleId: string;
    employeeId: string;
    managerId: string;
    storeId?: string | undefined;
}, {
    cycleId: string;
    employeeId: string;
    managerId: string;
    storeId?: string | undefined;
}>;
export declare const appraisalUpdateSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["PENDING", "SELF_REVIEW", "MANAGER_REVIEW", "COMPLETED"]>>;
    selfRating: z.ZodOptional<z.ZodNumber>;
    managerRating: z.ZodOptional<z.ZodNumber>;
    overallRating: z.ZodOptional<z.ZodNumber>;
    strengths: z.ZodOptional<z.ZodString>;
    improvements: z.ZodOptional<z.ZodString>;
    goals: z.ZodOptional<z.ZodString>;
    meetingNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "COMPLETED" | "PENDING" | "SELF_REVIEW" | "MANAGER_REVIEW" | undefined;
    selfRating?: number | undefined;
    managerRating?: number | undefined;
    overallRating?: number | undefined;
    strengths?: string | undefined;
    improvements?: string | undefined;
    goals?: string | undefined;
    meetingNotes?: string | undefined;
}, {
    status?: "COMPLETED" | "PENDING" | "SELF_REVIEW" | "MANAGER_REVIEW" | undefined;
    selfRating?: number | undefined;
    managerRating?: number | undefined;
    overallRating?: number | undefined;
    strengths?: string | undefined;
    improvements?: string | undefined;
    goals?: string | undefined;
    meetingNotes?: string | undefined;
}>;
export declare const shiftTemplateCreateSchema: z.ZodObject<{
    storeId: z.ZodString;
    name: z.ZodString;
    dayOfWeek: z.ZodNumber;
    startTime: z.ZodString;
    endTime: z.ZodString;
    minStaff: z.ZodDefault<z.ZodNumber>;
    role: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    storeId: string;
    minStaff: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    role?: string | undefined;
}, {
    name: string;
    storeId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    role?: string | undefined;
    minStaff?: number | undefined;
}>;
export declare const shiftEntryCreateSchema: z.ZodObject<{
    storeId: z.ZodString;
    userId: z.ZodString;
    date: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    role: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date: string;
    storeId: string;
    userId: string;
    startTime: string;
    endTime: string;
    role?: string | undefined;
    note?: string | undefined;
}, {
    date: string;
    storeId: string;
    userId: string;
    startTime: string;
    endTime: string;
    role?: string | undefined;
    note?: string | undefined;
}>;
export declare const shiftEntryUpdateSchema: z.ZodObject<{
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["PLANNED", "CONFIRMED", "SWAPPED", "CANCELLED"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "CANCELLED" | "PLANNED" | "CONFIRMED" | "SWAPPED" | undefined;
    role?: string | undefined;
    userId?: string | undefined;
    note?: string | undefined;
    startTime?: string | undefined;
    endTime?: string | undefined;
}, {
    status?: "CANCELLED" | "PLANNED" | "CONFIRMED" | "SWAPPED" | undefined;
    role?: string | undefined;
    userId?: string | undefined;
    note?: string | undefined;
    startTime?: string | undefined;
    endTime?: string | undefined;
}>;
export declare const shiftSwapRequestSchema: z.ZodObject<{
    swapWithUserId: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    swapWithUserId?: string | undefined;
    reason?: string | undefined;
}, {
    swapWithUserId?: string | undefined;
    reason?: string | undefined;
}>;
export declare const shiftAvailabilitySchema: z.ZodObject<{
    storeId: z.ZodString;
    userId: z.ZodString;
    date: z.ZodString;
    type: z.ZodEnum<["AVAILABLE", "UNAVAILABLE", "WISH", "VACATION", "SICK"]>;
    wishStart: z.ZodOptional<z.ZodString>;
    wishEnd: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "AVAILABLE" | "UNAVAILABLE" | "WISH" | "VACATION" | "SICK";
    date: string;
    storeId: string;
    userId: string;
    note?: string | undefined;
    wishStart?: string | undefined;
    wishEnd?: string | undefined;
}, {
    type: "AVAILABLE" | "UNAVAILABLE" | "WISH" | "VACATION" | "SICK";
    date: string;
    storeId: string;
    userId: string;
    note?: string | undefined;
    wishStart?: string | undefined;
    wishEnd?: string | undefined;
}>;
export declare const shiftClockSchema: z.ZodObject<{
    storeId: z.ZodString;
    action: z.ZodEnum<["CLOCK_IN", "CLOCK_OUT", "PAUSE_START", "PAUSE_END"]>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    storeId: string;
    action: "CLOCK_IN" | "CLOCK_OUT" | "PAUSE_START" | "PAUSE_END";
    note?: string | undefined;
}, {
    storeId: string;
    action: "CLOCK_IN" | "CLOCK_OUT" | "PAUSE_START" | "PAUSE_END";
    note?: string | undefined;
}>;
export declare const pulseSurveyCreateSchema: z.ZodObject<{
    title: z.ZodString;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    isAnonymous: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title: string;
    isAnonymous: boolean;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    title: string;
    startDate?: string | undefined;
    endDate?: string | undefined;
    isAnonymous?: boolean | undefined;
}>;
export declare const pulseQuestionCreateSchema: z.ZodObject<{
    text: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["RATING", "TEXT", "CHOICE"]>>;
    options: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "TEXT" | "RATING" | "CHOICE";
    sortOrder: number;
    text: string;
    options?: string | undefined;
}, {
    text: string;
    options?: string | undefined;
    type?: "TEXT" | "RATING" | "CHOICE" | undefined;
    sortOrder?: number | undefined;
}>;
export declare const pulseRespondSchema: z.ZodObject<{
    storeId: z.ZodOptional<z.ZodString>;
    answers: z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        valueRating: z.ZodOptional<z.ZodNumber>;
        valueText: z.ZodOptional<z.ZodString>;
        valueChoice: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        questionId: string;
        valueText?: string | undefined;
        valueRating?: number | undefined;
        valueChoice?: string | undefined;
    }, {
        questionId: string;
        valueText?: string | undefined;
        valueRating?: number | undefined;
        valueChoice?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    answers: {
        questionId: string;
        valueText?: string | undefined;
        valueRating?: number | undefined;
        valueChoice?: string | undefined;
    }[];
    storeId?: string | undefined;
}, {
    answers: {
        questionId: string;
        valueText?: string | undefined;
        valueRating?: number | undefined;
        valueChoice?: string | undefined;
    }[];
    storeId?: string | undefined;
}>;
export declare const wellbeingCheckInCreateSchema: z.ZodObject<{
    storeId: z.ZodOptional<z.ZodString>;
    moodScore: z.ZodNumber;
    energyLevel: z.ZodNumber;
    stressLevel: z.ZodNumber;
    workloadRating: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
    isAnonymous: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    isAnonymous: boolean;
    moodScore: number;
    energyLevel: number;
    stressLevel: number;
    workloadRating: number;
    storeId?: string | undefined;
    notes?: string | undefined;
}, {
    moodScore: number;
    energyLevel: number;
    stressLevel: number;
    workloadRating: number;
    storeId?: string | undefined;
    notes?: string | undefined;
    isAnonymous?: boolean | undefined;
}>;
export declare const wellbeingResourceCreateSchema: z.ZodObject<{
    title: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description?: string | undefined;
    category?: string | undefined;
    url?: string | undefined;
}, {
    title: string;
    description?: string | undefined;
    category?: string | undefined;
    url?: string | undefined;
}>;
export declare const wellbeingResourceUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    category?: string | undefined;
    url?: string | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    category?: string | undefined;
    url?: string | undefined;
}>;
export declare const briefingSectionSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    sortOrder: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    sortOrder: number;
}, {
    title: string;
    content: string;
    sortOrder: number;
}>;
export declare const briefingCreateSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    sections: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        content: z.ZodString;
        sortOrder: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        title: string;
        content: string;
        sortOrder: number;
    }, {
        title: string;
        content: string;
        sortOrder: number;
    }>, "many">>>;
    date: z.ZodString;
    type: z.ZodOptional<z.ZodEnum<["MORNING", "EVENING", "SPECIAL"]>>;
    scheduledFor: z.ZodOptional<z.ZodString>;
    storeId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    date: string;
    content: string;
    storeId: string;
    sections: {
        title: string;
        content: string;
        sortOrder: number;
    }[];
    type?: "MORNING" | "EVENING" | "SPECIAL" | undefined;
    scheduledFor?: string | undefined;
}, {
    title: string;
    date: string;
    storeId: string;
    type?: "MORNING" | "EVENING" | "SPECIAL" | undefined;
    content?: string | undefined;
    sections?: {
        title: string;
        content: string;
        sortOrder: number;
    }[] | undefined;
    scheduledFor?: string | undefined;
}>;
export type BriefingCreateInput = z.infer<typeof briefingCreateSchema>;
export declare const briefingUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    sections: z.ZodOptional<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        content: z.ZodString;
        sortOrder: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        title: string;
        content: string;
        sortOrder: number;
    }, {
        title: string;
        content: string;
        sortOrder: number;
    }>, "many">>;
    type: z.ZodOptional<z.ZodEnum<["MORNING", "EVENING", "SPECIAL"]>>;
    scheduledFor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    type?: "MORNING" | "EVENING" | "SPECIAL" | undefined;
    title?: string | undefined;
    content?: string | undefined;
    sections?: {
        title: string;
        content: string;
        sortOrder: number;
    }[] | undefined;
    scheduledFor?: string | null | undefined;
}, {
    type?: "MORNING" | "EVENING" | "SPECIAL" | undefined;
    title?: string | undefined;
    content?: string | undefined;
    sections?: {
        title: string;
        content: string;
        sortOrder: number;
    }[] | undefined;
    scheduledFor?: string | null | undefined;
}>;
export declare const handoverCreateSchema: z.ZodObject<{
    toUserId: z.ZodOptional<z.ZodString>;
    shiftDate: z.ZodString;
    shiftType: z.ZodOptional<z.ZodString>;
    salesUpdate: z.ZodOptional<z.ZodString>;
    openTasks: z.ZodOptional<z.ZodString>;
    incidents: z.ZodOptional<z.ZodString>;
    customerNotes: z.ZodOptional<z.ZodString>;
    stockNotes: z.ZodOptional<z.ZodString>;
    generalNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    shiftDate: string;
    toUserId?: string | undefined;
    shiftType?: string | undefined;
    salesUpdate?: string | undefined;
    openTasks?: string | undefined;
    incidents?: string | undefined;
    customerNotes?: string | undefined;
    stockNotes?: string | undefined;
    generalNotes?: string | undefined;
}, {
    shiftDate: string;
    toUserId?: string | undefined;
    shiftType?: string | undefined;
    salesUpdate?: string | undefined;
    openTasks?: string | undefined;
    incidents?: string | undefined;
    customerNotes?: string | undefined;
    stockNotes?: string | undefined;
    generalNotes?: string | undefined;
}>;
export type HandoverCreateInput = z.infer<typeof handoverCreateSchema>;
export declare const handoverUpdateSchema: z.ZodObject<{
    toUserId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "SUBMITTED", "ACKNOWLEDGED"]>>;
    salesUpdate: z.ZodOptional<z.ZodString>;
    openTasks: z.ZodOptional<z.ZodString>;
    incidents: z.ZodOptional<z.ZodString>;
    customerNotes: z.ZodOptional<z.ZodString>;
    stockNotes: z.ZodOptional<z.ZodString>;
    generalNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "DRAFT" | "SUBMITTED" | "ACKNOWLEDGED" | undefined;
    toUserId?: string | undefined;
    salesUpdate?: string | undefined;
    openTasks?: string | undefined;
    incidents?: string | undefined;
    customerNotes?: string | undefined;
    stockNotes?: string | undefined;
    generalNotes?: string | undefined;
}, {
    status?: "DRAFT" | "SUBMITTED" | "ACKNOWLEDGED" | undefined;
    toUserId?: string | undefined;
    salesUpdate?: string | undefined;
    openTasks?: string | undefined;
    incidents?: string | undefined;
    customerNotes?: string | undefined;
    stockNotes?: string | undefined;
    generalNotes?: string | undefined;
}>;
export declare const teamMessageCreateSchema: z.ZodObject<{
    title: z.ZodString;
    body: z.ZodString;
    priority: z.ZodOptional<z.ZodEnum<["NORMAL", "HIGH", "URGENT"]>>;
    targetType: z.ZodOptional<z.ZodEnum<["ALL", "STORE", "ROLE"]>>;
    targetStoreIds: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    body: string;
    priority?: "HIGH" | "URGENT" | "NORMAL" | undefined;
    targetType?: "STORE" | "ALL" | "ROLE" | undefined;
    targetStoreIds?: string | undefined;
}, {
    title: string;
    body: string;
    priority?: "HIGH" | "URGENT" | "NORMAL" | undefined;
    targetType?: "STORE" | "ALL" | "ROLE" | undefined;
    targetStoreIds?: string | undefined;
}>;
export type TeamMessageCreateInput = z.infer<typeof teamMessageCreateSchema>;
export declare const newsletterCreateSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    content?: string | undefined;
}, {
    title: string;
    content?: string | undefined;
}>;
export type NewsletterCreateInput = z.infer<typeof newsletterCreateSchema>;
export declare const newsletterUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "PUBLISHED", "ARCHIVED"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined;
    title?: string | undefined;
    content?: string | undefined;
}, {
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined;
    title?: string | undefined;
    content?: string | undefined;
}>;
export declare const newsletterSectionSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    sortOrder?: number | undefined;
}, {
    title: string;
    content: string;
    sortOrder?: number | undefined;
}>;
export declare const conversionGoalSchema: z.ZodObject<{
    period: z.ZodString;
    targetConversion: z.ZodOptional<z.ZodNumber>;
    targetAvgBasket: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    period: string;
    targetConversion?: number | undefined;
    targetAvgBasket?: number | undefined;
}, {
    period: string;
    targetConversion?: number | undefined;
    targetAvgBasket?: number | undefined;
}>;
export declare const clientProfileCreateSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phone: z.ZodOptional<z.ZodString>;
    whatsapp: z.ZodOptional<z.ZodString>;
    preferences: z.ZodOptional<z.ZodString>;
    sizes: z.ZodOptional<z.ZodString>;
    birthday: z.ZodOptional<z.ZodString>;
    vipLevel: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    consentEmail: z.ZodOptional<z.ZodBoolean>;
    consentSms: z.ZodOptional<z.ZodBoolean>;
    consentWhatsapp: z.ZodOptional<z.ZodBoolean>;
    consentGeneral: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email?: string | undefined;
    notes?: string | undefined;
    phone?: string | undefined;
    whatsapp?: string | undefined;
    preferences?: string | undefined;
    sizes?: string | undefined;
    birthday?: string | undefined;
    vipLevel?: string | undefined;
    consentEmail?: boolean | undefined;
    consentSms?: boolean | undefined;
    consentWhatsapp?: boolean | undefined;
    consentGeneral?: boolean | undefined;
}, {
    firstName: string;
    lastName: string;
    email?: string | undefined;
    notes?: string | undefined;
    phone?: string | undefined;
    whatsapp?: string | undefined;
    preferences?: string | undefined;
    sizes?: string | undefined;
    birthday?: string | undefined;
    vipLevel?: string | undefined;
    consentEmail?: boolean | undefined;
    consentSms?: boolean | undefined;
    consentWhatsapp?: boolean | undefined;
    consentGeneral?: boolean | undefined;
}>;
export declare const clientProfileUpdateSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phone: z.ZodOptional<z.ZodString>;
    whatsapp: z.ZodOptional<z.ZodString>;
    preferences: z.ZodOptional<z.ZodString>;
    sizes: z.ZodOptional<z.ZodString>;
    birthday: z.ZodOptional<z.ZodString>;
    vipLevel: z.ZodOptional<z.ZodString>;
    loyaltyPoints: z.ZodOptional<z.ZodNumber>;
    totalPurchases: z.ZodOptional<z.ZodNumber>;
    totalSpent: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    consentEmail: z.ZodOptional<z.ZodBoolean>;
    consentSms: z.ZodOptional<z.ZodBoolean>;
    consentWhatsapp: z.ZodOptional<z.ZodBoolean>;
    consentGeneral: z.ZodOptional<z.ZodBoolean>;
    lastVisit: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    notes?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    phone?: string | undefined;
    whatsapp?: string | undefined;
    preferences?: string | undefined;
    sizes?: string | undefined;
    birthday?: string | undefined;
    vipLevel?: string | undefined;
    consentEmail?: boolean | undefined;
    consentSms?: boolean | undefined;
    consentWhatsapp?: boolean | undefined;
    consentGeneral?: boolean | undefined;
    loyaltyPoints?: number | undefined;
    totalPurchases?: number | undefined;
    totalSpent?: number | undefined;
    lastVisit?: string | undefined;
}, {
    email?: string | undefined;
    notes?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    phone?: string | undefined;
    whatsapp?: string | undefined;
    preferences?: string | undefined;
    sizes?: string | undefined;
    birthday?: string | undefined;
    vipLevel?: string | undefined;
    consentEmail?: boolean | undefined;
    consentSms?: boolean | undefined;
    consentWhatsapp?: boolean | undefined;
    consentGeneral?: boolean | undefined;
    loyaltyPoints?: number | undefined;
    totalPurchases?: number | undefined;
    totalSpent?: number | undefined;
    lastVisit?: string | undefined;
}>;
export declare const clientInteractionSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<["VISIT", "CALL", "EMAIL", "SMS", "WHATSAPP", "EVENT"]>>;
    channel: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    purchaseAmount: z.ZodOptional<z.ZodNumber>;
    date: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type?: "VISIT" | "CALL" | "EMAIL" | "SMS" | "WHATSAPP" | "EVENT" | undefined;
    date?: string | undefined;
    notes?: string | undefined;
    channel?: string | undefined;
    purchaseAmount?: number | undefined;
}, {
    type?: "VISIT" | "CALL" | "EMAIL" | "SMS" | "WHATSAPP" | "EVENT" | undefined;
    date?: string | undefined;
    notes?: string | undefined;
    channel?: string | undefined;
    purchaseAmount?: number | undefined;
}>;
export declare const clientTaskSchema: z.ZodObject<{
    title: z.ZodString;
    dueDate: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["OPEN", "DONE", "CANCELLED"]>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    status?: "OPEN" | "CANCELLED" | "DONE" | undefined;
    dueDate?: string | undefined;
}, {
    title: string;
    status?: "OPEN" | "CANCELLED" | "DONE" | undefined;
    dueDate?: string | undefined;
}>;
export declare const clientAppointmentCreateSchema: z.ZodObject<{
    clientId: z.ZodOptional<z.ZodString>;
    storeId: z.ZodString;
    type: z.ZodOptional<z.ZodEnum<["BERATUNG", "STYLE_BERATUNG", "VIP_EVENT", "PERSONAL_SHOPPING", "ANPROBE", "SONSTIGES"]>>;
    title: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
    startsAt: z.ZodString;
    endsAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    storeId: string;
    startsAt: string;
    endsAt: string;
    type?: "BERATUNG" | "STYLE_BERATUNG" | "VIP_EVENT" | "PERSONAL_SHOPPING" | "ANPROBE" | "SONSTIGES" | undefined;
    notes?: string | undefined;
    clientId?: string | undefined;
}, {
    title: string;
    storeId: string;
    startsAt: string;
    endsAt: string;
    type?: "BERATUNG" | "STYLE_BERATUNG" | "VIP_EVENT" | "PERSONAL_SHOPPING" | "ANPROBE" | "SONSTIGES" | undefined;
    notes?: string | undefined;
    clientId?: string | undefined;
}>;
export declare const clientAppointmentUpdateSchema: z.ZodObject<{
    clientId: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    startsAt: z.ZodOptional<z.ZodString>;
    endsAt: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["GEPLANT", "BESTAETIGT", "ABGESCHLOSSEN", "ABGESAGT"]>>;
}, "strip", z.ZodTypeAny, {
    type?: string | undefined;
    status?: "GEPLANT" | "BESTAETIGT" | "ABGESCHLOSSEN" | "ABGESAGT" | undefined;
    title?: string | undefined;
    notes?: string | undefined;
    clientId?: string | undefined;
    startsAt?: string | undefined;
    endsAt?: string | undefined;
}, {
    type?: string | undefined;
    status?: "GEPLANT" | "BESTAETIGT" | "ABGESCHLOSSEN" | "ABGESAGT" | undefined;
    title?: string | undefined;
    notes?: string | undefined;
    clientId?: string | undefined;
    startsAt?: string | undefined;
    endsAt?: string | undefined;
}>;
export declare const stockCalloutCreateSchema: z.ZodObject<{
    sku: z.ZodString;
    productName: z.ZodString;
    currentStock: z.ZodOptional<z.ZodNumber>;
    reorderPoint: z.ZodOptional<z.ZodNumber>;
    requestedQty: z.ZodNumber;
    urgency: z.ZodOptional<z.ZodEnum<["LOW", "NORMAL", "HIGH", "CRITICAL"]>>;
}, "strip", z.ZodTypeAny, {
    sku: string;
    productName: string;
    requestedQty: number;
    currentStock?: number | undefined;
    reorderPoint?: number | undefined;
    urgency?: "LOW" | "HIGH" | "CRITICAL" | "NORMAL" | undefined;
}, {
    sku: string;
    productName: string;
    requestedQty: number;
    currentStock?: number | undefined;
    reorderPoint?: number | undefined;
    urgency?: "LOW" | "HIGH" | "CRITICAL" | "NORMAL" | undefined;
}>;
export declare const stockCalloutUpdateSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["OPEN", "ORDERED", "RECEIVED", "CANCELLED", "OFFERED", "TRANSFER", "RESOLVED"]>>;
    currentStock: z.ZodOptional<z.ZodNumber>;
    requestedQty: z.ZodOptional<z.ZodNumber>;
    urgency: z.ZodOptional<z.ZodEnum<["LOW", "NORMAL", "HIGH", "CRITICAL"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "OPEN" | "RESOLVED" | "CANCELLED" | "ORDERED" | "RECEIVED" | "OFFERED" | "TRANSFER" | undefined;
    currentStock?: number | undefined;
    requestedQty?: number | undefined;
    urgency?: "LOW" | "HIGH" | "CRITICAL" | "NORMAL" | undefined;
}, {
    status?: "OPEN" | "RESOLVED" | "CANCELLED" | "ORDERED" | "RECEIVED" | "OFFERED" | "TRANSFER" | undefined;
    currentStock?: number | undefined;
    requestedQty?: number | undefined;
    urgency?: "LOW" | "HIGH" | "CRITICAL" | "NORMAL" | undefined;
}>;
export declare const stockCalloutOfferSchema: z.ZodObject<{
    availableQty: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    availableQty: number;
    notes?: string | undefined;
}, {
    availableQty: number;
    notes?: string | undefined;
}>;
export declare const stockBoardItemCreateSchema: z.ZodObject<{
    sku: z.ZodString;
    productName: z.ZodString;
    availableQty: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sku: string;
    productName: string;
    availableQty: number;
    notes?: string | undefined;
}, {
    sku: string;
    productName: string;
    availableQty: number;
    notes?: string | undefined;
}>;
export declare const customerOrderCreateSchema: z.ZodObject<{
    orderNumber: z.ZodString;
    customerName: z.ZodString;
    customerEmail: z.ZodOptional<z.ZodString>;
    trackingNumber: z.ZodOptional<z.ZodString>;
    carrier: z.ZodOptional<z.ZodString>;
    estimatedDelivery: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    orderNumber: string;
    customerName: string;
    customerEmail?: string | undefined;
    trackingNumber?: string | undefined;
    carrier?: string | undefined;
    estimatedDelivery?: string | undefined;
}, {
    orderNumber: string;
    customerName: string;
    customerEmail?: string | undefined;
    trackingNumber?: string | undefined;
    carrier?: string | undefined;
    estimatedDelivery?: string | undefined;
}>;
export declare const customerOrderUpdateSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["ORDERED", "SHIPPED", "IN_TRANSIT", "DELIVERED", "RETURNED"]>>;
    trackingNumber: z.ZodOptional<z.ZodString>;
    carrier: z.ZodOptional<z.ZodString>;
    estimatedDelivery: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "ORDERED" | "SHIPPED" | "IN_TRANSIT" | "DELIVERED" | "RETURNED" | undefined;
    trackingNumber?: string | undefined;
    carrier?: string | undefined;
    estimatedDelivery?: string | undefined;
}, {
    status?: "ORDERED" | "SHIPPED" | "IN_TRANSIT" | "DELIVERED" | "RETURNED" | undefined;
    trackingNumber?: string | undefined;
    carrier?: string | undefined;
    estimatedDelivery?: string | undefined;
}>;
export declare const orderStatusUpdateSchema: z.ZodObject<{
    status: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    notes?: string | undefined;
}, {
    status: string;
    notes?: string | undefined;
}>;
export declare const frSettingsSchema: z.ZodObject<{
    maxItems: z.ZodOptional<z.ZodNumber>;
    warningMinutes: z.ZodOptional<z.ZodNumber>;
    alertMinutes: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    maxItems?: number | undefined;
    warningMinutes?: number | undefined;
    alertMinutes?: number | undefined;
}, {
    maxItems?: number | undefined;
    warningMinutes?: number | undefined;
    alertMinutes?: number | undefined;
}>;
export declare const frRoomCreateSchema: z.ZodObject<{
    number: z.ZodNumber;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    number: number;
    name?: string | undefined;
}, {
    number: number;
    name?: string | undefined;
}>;
export declare const frCheckInSchema: z.ZodObject<{
    roomId: z.ZodString;
    staffId: z.ZodOptional<z.ZodString>;
    itemsIn: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    roomId: string;
    itemsIn: number;
    notes?: string | undefined;
    staffId?: string | undefined;
}, {
    roomId: string;
    itemsIn: number;
    notes?: string | undefined;
    staffId?: string | undefined;
}>;
export declare const frCheckOutSchema: z.ZodObject<{
    itemsReturned: z.ZodNumber;
    itemsPurchased: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    itemsReturned: number;
    itemsPurchased: number;
}, {
    itemsReturned: number;
    itemsPurchased: number;
}>;
export declare const frAddItemsSchema: z.ZodObject<{
    additionalItems: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    additionalItems: number;
}, {
    additionalItems: number;
}>;
//# sourceMappingURL=validators.d.ts.map