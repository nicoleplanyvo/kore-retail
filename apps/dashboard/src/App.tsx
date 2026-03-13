import { Routes, Route } from 'react-router-dom';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TenantsListPage } from './pages/TenantsListPage';
import { TenantCreatePage } from './pages/TenantCreatePage';
import { TenantDetailPage } from './pages/TenantDetailPage';
import { ToolsOverviewPage } from './pages/ToolsOverviewPage';
import { StoresListPage } from './pages/StoresListPage';
import { StoreDetailPage } from './pages/StoreDetailPage';
import { UsersListPage } from './pages/UsersListPage';
import { UserCreatePage } from './pages/UserCreatePage';
import { UserDetailPage } from './pages/UserDetailPage';
import GdprPage from './pages/GdprPage';
import { ReportingPage } from './pages/ReportingPage';
import { StoreExcellenceAuditRoutes } from './tools/store-excellence-audit/index';
import { ChecklistenRoutes } from './tools/checklisten/index';
import SopBibliothekRoutes from './tools/sop-bibliothek/index';
import VmComplianceRoutes from './tools/vm-compliance/index';
import StoreStandardsRoutes from './tools/store-standards/index';
import KpiDashboardRoutes from './tools/kpi-dashboard/index';
import BudgetTrackerRoutes from './tools/budget-tracker/index';
import ForecastRoutes from './tools/forecast/index';
import LossPreventionRoutes from './tools/loss-prevention/index';
import InventoryRoutes from './tools/inventory/index';
import LiveFloorRoutes from './tools/live-floor/index';
import FrTrackingRoutes from './tools/fr-tracking/index';
import VmGuidelinesRoutes from './tools/vm-guidelines/index';
import MaintenanceRoutes from './tools/maintenance/index';
import TrainingHubRoutes from './tools/training-hub/index';
import TrainingHoursRoutes from './tools/training-hours/index';
import ChallengesRoutes from './tools/challenges/index';
import OnboardingRoutes from './tools/onboarding/index';
import CoachingRoutes from './tools/coaching/index';
import PdpPipRoutes from './tools/pdp-pip/index';
import AppraisalsRoutes from './tools/appraisals/index';
import ShiftPlanningRoutes from './tools/shift-planning/index';
import PulseSurveyRoutes from './tools/pulse-survey/index';
import WellbeingRoutes from './tools/wellbeing/index';
import BriefingsRoutes from './tools/briefings/index';
import HandoverRoutes from './tools/handover/index';
import TeamPushRoutes from './tools/team-push/index';
import NewsletterRoutes from './tools/newsletter/index';
import FrConversionRoutes from './tools/fr-conversion/index';
import ClientelingRoutes from './tools/clienteling/index';
import StockCalloutsRoutes from './tools/stock-callouts/index';
import TrackTraceRoutes from './tools/track-trace/index';
import MultiStoreRoutes from './tools/multi-store/index';
import RmDashboardRoutes from './tools/rm-dashboard/index';

export function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Home — alle authentifizierten User */}
          <Route path="/" element={<DashboardPage />} />

          {/* Tools — alle mit Tool-Zugang (API prueft den Zugriff) */}
          <Route path="/tools/sea/*" element={<StoreExcellenceAuditRoutes />} />
          <Route path="/tools/checklisten/*" element={<ChecklistenRoutes />} />
          <Route path="/tools/sop/*" element={<SopBibliothekRoutes />} />
          <Route path="/tools/vm-compliance/*" element={<VmComplianceRoutes />} />
          <Route path="/tools/store-standards/*" element={<StoreStandardsRoutes />} />

          {/* Tools — Performance & Sichtbarkeit */}
          <Route path="/tools/kpi/*" element={<KpiDashboardRoutes />} />
          <Route path="/tools/budget/*" element={<BudgetTrackerRoutes />} />
          <Route path="/tools/forecast/*" element={<ForecastRoutes />} />
          <Route path="/tools/loss-prevention/*" element={<LossPreventionRoutes />} />
          <Route path="/tools/inventory/*" element={<InventoryRoutes />} />

          {/* Tools — Floor in Echtzeit */}
          <Route path="/tools/live-floor/*" element={<LiveFloorRoutes />} />
          <Route path="/tools/fr-tracking/*" element={<FrTrackingRoutes />} />
          <Route path="/tools/vm-guidelines/*" element={<VmGuidelinesRoutes />} />
          <Route path="/tools/maintenance/*" element={<MaintenanceRoutes />} />

          {/* Tools — Training & Entwicklung */}
          <Route path="/tools/training-hub/*" element={<TrainingHubRoutes />} />
          <Route path="/tools/training-hours/*" element={<TrainingHoursRoutes />} />
          <Route path="/tools/challenges/*" element={<ChallengesRoutes />} />
          <Route path="/tools/onboarding/*" element={<OnboardingRoutes />} />

          {/* Tools — Coaching & People */}
          <Route path="/tools/coaching/*" element={<CoachingRoutes />} />
          <Route path="/tools/pdp-pip/*" element={<PdpPipRoutes />} />
          <Route path="/tools/appraisals/*" element={<AppraisalsRoutes />} />
          <Route path="/tools/shift-planning/*" element={<ShiftPlanningRoutes />} />
          <Route path="/tools/pulse-survey/*" element={<PulseSurveyRoutes />} />
          <Route path="/tools/wellbeing/*" element={<WellbeingRoutes />} />

          {/* Tools — Kommunikation & Signal */}
          <Route path="/tools/briefings/*" element={<BriefingsRoutes />} />
          <Route path="/tools/handover/*" element={<HandoverRoutes />} />
          <Route path="/tools/team-push/*" element={<TeamPushRoutes />} />
          <Route path="/tools/newsletter/*" element={<NewsletterRoutes />} />

          {/* Tools — Customer, Clienteling & Stock */}
          <Route path="/tools/fr-conversion/*" element={<FrConversionRoutes />} />
          <Route path="/tools/clienteling/*" element={<ClientelingRoutes />} />
          <Route path="/tools/stock-callouts/*" element={<StockCalloutsRoutes />} />
          <Route path="/tools/track-trace/*" element={<TrackTraceRoutes />} />

          {/* Tools — Regional Insights */}
          <Route path="/tools/multi-store/*" element={<MultiStoreRoutes />} />
          <Route path="/tools/rm-dashboard/*" element={<RmDashboardRoutes />} />

          {/* === Verwaltung (Admin) === */}

          {/* store_manager+ (Benutzer verwalten, Stores) */}
          <Route element={<ProtectedRoute minRole="store_manager" />}>
            <Route path="/admin/users" element={<UsersListPage />} />
            <Route path="/admin/users/new" element={<UserCreatePage />} />
            <Route path="/admin/users/:id" element={<UserDetailPage />} />
            <Route path="/admin/stores" element={<StoresListPage />} />
            <Route path="/admin/stores/:id" element={<StoreDetailPage />} />
          </Route>

          {/* regional_manager+ (Tool-Katalog) */}
          <Route element={<ProtectedRoute minRole="regional_manager" />}>
            <Route path="/admin/tools" element={<ToolsOverviewPage />} />
          </Route>

          {/* tenant_admin+ */}
          <Route element={<ProtectedRoute minRole="tenant_admin" />}>
            <Route path="/admin/gdpr" element={<GdprPage />} />
            <Route path="/admin/reporting" element={<ReportingPage />} />
          </Route>

          {/* Nur kore_admin */}
          <Route element={<ProtectedRoute minRole="kore_admin" />}>
            <Route path="/admin/tenants" element={<TenantsListPage />} />
            <Route path="/admin/tenants/new" element={<TenantCreatePage />} />
            <Route path="/admin/tenants/:id" element={<TenantDetailPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
