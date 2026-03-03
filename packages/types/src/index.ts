// === User & Auth ===

export type UserRole = 'kore_admin' | 'tenant_admin' | 'store_manager' | 'learner';

export type Plan = 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';

export type SubStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIALING';

export type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'CHECKLIST';

export type EnrollmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';

export interface JWTPayload {
  sub: string;
  tenantId: string;
  role: UserRole;
  plan: Plan;
  iat: number;
  exp: number;
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

// === KORE Tools ===

export type KoreTool = 'TRAIN' | 'PULSE' | 'SHIFT';

export interface ToolAssignment {
  id: string;
  tenantId: string;
  tool: KoreTool;
  assignedAt: string;
  isActive: boolean;
}

// === Tenant ===

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
  status: SubStatus;
  contactEmail: string | null;
  contactName: string | null;
  contactPhone: string | null;
  maxUsers: number;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  tools: ToolAssignment[];
  _count?: { users: number };
}

// === Dashboard ===

export interface DashboardStats {
  totalTenants: number;
  activeTenants: number;
  tenantsByPlan: Record<Plan, number>;
  toolCounts: Record<KoreTool, number>;
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
  plan?: Plan;
  status?: SubStatus;
}

// === Navigation ===

export interface NavItem {
  label: string;
  href: string;
}
