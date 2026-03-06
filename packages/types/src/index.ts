// === User & Auth ===

export type UserRole =
  | 'kore_admin'
  | 'tenant_admin'
  | 'regional_manager'
  | 'multisite_manager'
  | 'store_manager'
  | 'learner';

/** Hierarchie: Index 0 = höchste Berechtigung */
export const ROLE_HIERARCHY: UserRole[] = [
  'kore_admin',
  'tenant_admin',
  'regional_manager',
  'multisite_manager',
  'store_manager',
  'learner',
];

/** Prüft ob roleA ≥ roleB in der Hierarchie */
export function hasMinRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY.indexOf(userRole) <= ROLE_HIERARCHY.indexOf(requiredRole);
}

export type SubStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIALING';

export type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'CHECKLIST';

export type EnrollmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';

export interface JWTPayload {
  sub: string;
  tenantId: string | null;
  role: UserRole;
  impersonatedBy?: string; // Original-Admin-ID bei Impersonation
  iat: number;
  exp: number;
}

// === Auth User (Frontend) ===

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  impersonatedBy?: string;
  storeAssignments?: string[]; // Store-IDs
}

// === User Store Assignment ===

export interface UserStoreAssignment {
  id: string;
  userId: string;
  storeId: string;
  store?: Store;
  assignedAt: string;
}

// === Website Forms ===

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

// === KPI (Pulse) ===

export interface KPIEntryInput {
  storeId: string;
  date: string;
  revenue: number;
  transactions: number;
  footfall?: number;
  unitsSold?: number;
  staffHours?: number;
}

// === Tool Categories & Definitions ===

export type ToolCategory =
  | 'STANDARDS_COMPLIANCE'
  | 'PERFORMANCE'
  | 'FLOOR'
  | 'TRAINING'
  | 'COACHING_PEOPLE'
  | 'KOMMUNIKATION'
  | 'CUSTOMER_STOCK'
  | 'REGIONAL_INSIGHTS';

export interface ToolDefinition {
  id: string;
  key: string;
  name: string;
  description: string | null;
  category: ToolCategory;
  icon: string | null;
  priceMonthly: number; // Cent pro Store pro Monat
  isActive: boolean;
  sortOrder: number;
}

// === Store ===

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
  _count?: { tools: number };
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

// === Tenant ===

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
  _count?: { users: number; stores: number };
}

// === Dashboard ===

export interface DashboardStats {
  totalTenants: number;
  activeTenants: number;
  totalStores: number;
  activeStores: number;
  totalToolBookings: number;
  mrr: number; // Monthly Recurring Revenue in Cent
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

// === GDPR / Audit ===

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

// === Store User Assignment (reverse direction) ===

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

// === Reporting Hierarchy ===

export interface ReportingManager {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  stores: { id: string; name: string; city: string | null }[];
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
  tenant: { id: string; name: string };
  stores: ReportingStore[];
  managers: ReportingManager[];
}

// === Navigation ===

export interface NavItem {
  label: string;
  href: string;
}
