export type UserRole = 'kore_admin' | 'tenant_admin' | 'regional_manager' | 'multisite_manager' | 'store_manager' | 'learner';
/** Hierarchie: Index 0 = höchste Berechtigung */
export declare const ROLE_HIERARCHY: UserRole[];
/** Prüft ob roleA ≥ roleB in der Hierarchie */
export declare function hasMinRole(userRole: UserRole, requiredRole: UserRole): boolean;
/** Prüft ob creator eine Rolle STRIKT unter sich erstellen kann */
export declare function canCreateRole(creatorRole: UserRole, targetRole: UserRole): boolean;
/** Gibt alle Rollen zurück, die ein User erstellen kann (strikt unterhalb) */
export declare function getCreatableRoles(creatorRole: UserRole): UserRole[];
export type SubStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIALING';
export type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'CHECKLIST';
export type EnrollmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
export interface JWTPayload {
    sub: string;
    tenantId: string | null;
    role: UserRole;
    impersonatedBy?: string;
    iat: number;
    exp: number;
}
export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    tenantId?: string;
    impersonatedBy?: string;
    storeAssignments?: string[];
}
export interface UserStoreAssignment {
    id: string;
    userId: string;
    storeId: string;
    store?: Store;
    assignedAt: string;
}
export interface AuditRequestInput {
    name: string;
    company: string;
    storeCount: string;
    challenge: string;
    email: string;
}
export interface ContactFormInput {
    name: string;
    email: string;
    company?: string;
    message: string;
}
export interface KPIEntryInput {
    storeId: string;
    date: string;
    revenue: number;
    transactions: number;
    footfall?: number;
    unitsSold?: number;
    staffHours?: number;
}
export type ToolCategory = 'STANDARDS_COMPLIANCE' | 'PERFORMANCE' | 'FLOOR' | 'TRAINING' | 'COACHING_PEOPLE' | 'KOMMUNIKATION' | 'CUSTOMER_STOCK' | 'REGIONAL_INSIGHTS';
export interface ToolDefinition {
    id: string;
    key: string;
    name: string;
    description: string | null;
    category: ToolCategory;
    icon: string | null;
    priceMonthly: number;
    isActive: boolean;
    sortOrder: number;
}
export interface Store {
    id: string;
    tenantId: string;
    name: string;
    city: string | null;
    address: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    tools?: StoreToolAssignment[];
    _count?: {
        tools: number;
    };
}
export interface StoreToolAssignment {
    id: string;
    storeId: string;
    toolId: string;
    tool: ToolDefinition;
    isActive: boolean;
    assignedAt: string;
    config: string | null;
}
export interface Tenant {
    id: string;
    name: string;
    slug: string;
    status: SubStatus;
    contactEmail: string | null;
    contactName: string | null;
    contactPhone: string | null;
    maxUsers: number;
    logoUrl: string | null;
    createdAt: string;
    updatedAt: string;
    stores?: Store[];
    _count?: {
        users: number;
        stores: number;
    };
}
export interface DashboardStats {
    totalTenants: number;
    activeTenants: number;
    totalStores: number;
    activeStores: number;
    totalToolBookings: number;
    mrr: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}
export interface TenantListParams {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: SubStatus;
}
export interface AuditLogEntry {
    id: string;
    tenantId: string | null;
    userId: string | null;
    action: string;
    entity: string;
    entityId: string | null;
    details: string | null;
    ipAddress: string | null;
    createdAt: string;
}
export interface DataProcessingConsent {
    id: string;
    tenantId: string;
    consentType: string;
    grantedAt: string;
    grantedBy: string;
    revokedAt: string | null;
    revokedBy: string | null;
    version: string;
    document: string | null;
}
export interface StoreUserAssignment {
    id: string;
    userId: string;
    storeId: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        isActive: boolean;
    };
    assignedAt: string;
}
export interface ReportingManager {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    stores: {
        id: string;
        name: string;
        city: string | null;
    }[];
}
export interface ReportingStore {
    id: string;
    name: string;
    city: string | null;
    isActive: boolean;
    users: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        assignedAt: string;
    }[];
}
export interface ReportingHierarchy {
    tenant: {
        id: string;
        name: string;
    };
    stores: ReportingStore[];
    managers: ReportingManager[];
}
export interface NavItem {
    label: string;
    href: string;
}
//# sourceMappingURL=index.d.ts.map