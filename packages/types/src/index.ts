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

/** Prüft ob creator eine Rolle STRIKT unter sich erstellen kann */
export function canCreateRole(creatorRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY.indexOf(creatorRole) < ROLE_HIERARCHY.indexOf(targetRole);
}

/** Gibt alle Rollen zurück, die ein User erstellen kann (strikt unterhalb) */
export function getCreatableRoles(creatorRole: UserRole): UserRole[] {
  const idx = ROLE_HIERARCHY.indexOf(creatorRole);
  return ROLE_HIERARCHY.slice(idx + 1);
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

export interface TenantBranding {
  tenantName: string;
  logoUrl: string | null;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  impersonatedBy?: string;
  storeAssignments?: string[]; // Store-IDs
  regionAssignments?: string[]; // Region-IDs (für regional_manager)
  tenantBranding?: TenantBranding;
}

// === User Store Assignment ===

export interface UserStoreAssignment {
  id: string;
  userId: string;
  storeId: string;
  store?: Store;
  assignedAt: string;
}

// === User Region Assignment ===

export interface UserRegionAssignment {
  id: string;
  userId: string;
  regionId: string;
  region?: Region;
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
  learnerAccessible: boolean;
}

// === Region ===

export interface Region {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stores?: Store[];
  _count?: { stores: number };
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

export interface ReportingRegion {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  stores: ReportingStore[];
}

export interface ReportingHierarchy {
  tenant: { id: string; name: string };
  regions: ReportingRegion[];
  stores: ReportingStore[];
  managers: ReportingManager[];
}

// === Navigation ===

export interface NavItem {
  label: string;
  href: string;
}

// ============================================================
// Store Excellence Audit — Types
// ============================================================

export type AuditSessionStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface AuditTemplate {
  id: string;
  tenantId: string | null;
  name: string;
  description: string | null;
  version: number;
  isDefault: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  categories?: AuditCategory[];
}

export interface AuditCategory {
  id: string;
  templateId: string;
  name: string;
  description: string | null;
  sortOrder: number;
  weight: number;
  criteria?: AuditCriterion[];
  _count?: { criteria: number };
}

export interface AuditCriterion {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isRequired: boolean;
  photoRequired: boolean;
}

export interface AuditSession {
  id: string;
  tenantId: string;
  storeId: string;
  templateId: string;
  conductedBy: string;
  storeLocation: string | null;
  status: AuditSessionStatus;
  overallScore: number | null;
  notes: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  template?: AuditTemplate;
  store?: { id: string; name: string; city: string | null };
  responses?: AuditResponse[];
  _count?: { responses: number };
}

export interface AuditResponse {
  id: string;
  sessionId: string;
  criterionId: string;
  scorePercent: number | null;
  passed: boolean | null;
  comment: string | null;
  photoPath: string | null;
  createdAt: string;
  updatedAt: string;
  criterion?: AuditCriterion;
}

export interface AuditSummaryStats {
  totalAudits: number;
  averageScore: number;
  passRate: number;
  recentTrend: 'up' | 'down' | 'stable';
}

// ============================================================
// Checklisten Tool — Types
// ============================================================

export type ChecklistItemType = 'BOOLEAN' | 'TEXT' | 'NUMBER' | 'PHOTO';
export type ChecklistSessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ChecklistTemplate {
  id: string;
  tenantId: string | null;
  name: string;
  description: string | null;
  version: number;
  isDefault: boolean;
  isActive: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistSection {
  id: string;
  templateId: string;
  name: string;
  sortOrder: number;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  sectionId: string;
  text: string;
  type: ChecklistItemType;
  isRequired: boolean;
  sortOrder: number;
}

export interface ChecklistSession {
  id: string;
  tenantId: string;
  storeId: string;
  templateId: string;
  conductedBy: string;
  status: ChecklistSessionStatus;
  completionRate: number;
  notes: string | null;
  startedAt: string;
  completedAt: string | null;
}

export interface ChecklistEntry {
  id: string;
  sessionId: string;
  itemId: string;
  valueBool: boolean | null;
  valueText: string | null;
  valueNumber: number | null;
  photoPath: string | null;
  comment: string | null;
  answeredAt: string;
}

// ============================================================
// SOP Bibliothek Tool — Types
// ============================================================

export type SopStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface SopCategory {
  id: string;
  tenantId: string | null;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface SopDocument {
  id: string;
  tenantId: string | null;
  categoryId: string;
  title: string;
  content: string;
  version: number;
  status: SopStatus;
  createdBy: string;
  attachmentPath: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SopAcknowledgment {
  id: string;
  sopId: string;
  userId: string;
  acknowledgedAt: string;
}

// ============================================================
// VM Foto-Compliance Tool — Types
// ============================================================

export type VmSubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface VmGuideline {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  category: string | null;
  referencePhoto: string | null;
  isActive: boolean;
  sortOrder: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface VmSubmission {
  id: string;
  tenantId: string;
  guidelineId: string;
  storeId: string;
  submittedBy: string;
  photoPath: string;
  status: VmSubmissionStatus;
  reviewedBy: string | null;
  reviewNote: string | null;
  submittedAt: string;
  reviewedAt: string | null;
}

// ============================================================
// Store Standards Tool — Types
// ============================================================

export type StandardOperator = 'GTE' | 'LTE' | 'EQ' | 'GT' | 'LT';
export type StandardEvaluationStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface StandardCategory {
  id: string;
  tenantId: string | null;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface StandardDefinition {
  id: string;
  categoryId: string;
  tenantId: string | null;
  name: string;
  description: string | null;
  unit: string | null;
  targetValue: number;
  operator: StandardOperator;
  weight: number;
  isActive: boolean;
  sortOrder: number;
}

export interface StandardEvaluation {
  id: string;
  tenantId: string;
  storeId: string;
  evaluatedBy: string;
  period: string;
  overallScore: number | null;
  notes: string | null;
  status: StandardEvaluationStatus;
  evaluatedAt: string;
  completedAt: string | null;
}

export interface StandardScore {
  id: string;
  evaluationId: string;
  definitionId: string;
  actualValue: number;
  passed: boolean;
  score: number;
  comment: string | null;
}

// ============================================================
// KPI Dashboard (Pulse) — Types
// ============================================================

export interface KpiEntry {
  id: string;
  tenantId: string;
  storeId: string;
  date: string;
  revenue: number;
  transactions: number;
  footfall: number | null;
  unitsSold: number | null;
  staffHours: number | null;
  enteredBy: string;
  createdAt: string;
  updatedAt: string;
  store?: { id: string; name: string; city: string | null };
}

export interface KpiSummary {
  totalRevenue: number;
  totalTransactions: number;
  totalFootfall: number;
  avgConversion: number;
  avgUPT: number;
  storeCount: number;
}

// ============================================================
// Budget Tracker — Types
// ============================================================

export type BudgetType = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
export type BudgetCategory = 'REVENUE' | 'COGS' | 'LABOR' | 'RENT' | 'MARKETING' | 'OTHER';

export interface BudgetPeriod {
  id: string;
  tenantId: string;
  storeId: string;
  period: string;
  budgetType: BudgetType;
  revenue: number;
  cogs: number;
  labor: number;
  rent: number;
  marketing: number;
  other: number;
  notes: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  store?: { id: string; name: string; city: string | null };
  actuals?: BudgetActual[];
}

export interface BudgetActual {
  id: string;
  budgetPeriodId: string;
  category: BudgetCategory;
  actualAmount: number;
  date: string;
  description: string | null;
  enteredBy: string;
  createdAt: string;
}

// ============================================================
// Forecast — Types
// ============================================================

export type ForecastType = 'REVENUE' | 'TRANSACTIONS' | 'FOOTFALL';
export type ForecastMethod = 'MANUAL' | 'TREND' | 'AI';

export interface Forecast {
  id: string;
  tenantId: string;
  storeId: string;
  period: string;
  forecastType: ForecastType;
  forecastValue: number;
  actualValue: number | null;
  confidence: number | null;
  method: ForecastMethod;
  notes: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  store?: { id: string; name: string; city: string | null };
}

// ============================================================
// Loss Prevention — Types
// ============================================================

export type LossCategory = 'THEFT' | 'DAMAGE' | 'ADMIN_ERROR' | 'SUPPLIER' | 'OTHER';
export type LossSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type LossStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';

export interface LossIncident {
  id: string;
  tenantId: string;
  storeId: string;
  incidentDate: string;
  category: LossCategory;
  amount: number;
  description: string;
  severity: LossSeverity;
  status: LossStatus;
  resolution: string | null;
  reportedBy: string;
  assignedTo: string | null;
  photoPath: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  store?: { id: string; name: string; city: string | null };
}

// ============================================================
// Inventory — Types
// ============================================================

export type InventoryCountType = 'FULL' | 'PARTIAL' | 'CYCLE';
export type InventoryCountStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface InventoryCount {
  id: string;
  tenantId: string;
  storeId: string;
  countDate: string;
  countType: InventoryCountType;
  status: InventoryCountStatus;
  totalItems: number;
  countedItems: number;
  discrepancies: number;
  totalValue: number;
  notes: string | null;
  conductedBy: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  store?: { id: string; name: string; city: string | null };
  items?: InventoryItem[];
}

export interface InventoryItem {
  id: string;
  countId: string;
  sku: string;
  productName: string;
  category: string | null;
  expectedQty: number;
  actualQty: number;
  unitPrice: number;
  discrepancy: number;
  discrepancyValue: number;
  notes: string | null;
  countedAt: string | null;
}

// ============================================================
// Notifications — Types
// ============================================================

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}
