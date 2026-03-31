import { Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { AuthLayout } from './layouts/AuthLayout';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { ConsultingPage } from './pages/ConsultingPage';
import { TrainingPage } from './pages/TrainingPage';
import { SuitePage } from './pages/SuitePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuditPage } from './pages/AuditPage';
import { LegalPage } from './pages/LegalPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { LoginPage } from './pages/LoginPage';
import { ToolsHomePage } from './pages/ToolsHomePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { useAnalytics } from './hooks/useAnalytics';
import { ScrollToTop } from './components/ScrollToTop';

// Tool-Routes importieren
import StoreExcellenceAuditRoutes from './tools/store-excellence-audit/index';
import ChecklistenRoutes from './tools/checklisten/index';
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
  useAnalytics();

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Marketing-Seiten (oeffentlich) */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/consulting" element={<ConsultingPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/suite" element={<SuitePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Route>

        {/* Login */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Geschuetzter App-Bereich */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Home — Alle authentifizierten User */}
            <Route path="/app" element={<ToolsHomePage />} />
            <Route path="/app/notifications" element={<NotificationsPage />} />

            {/* Standards & Compliance */}
            <Route path="/app/tools/sea/*" element={<StoreExcellenceAuditRoutes />} />
            <Route path="/app/tools/checklisten/*" element={<ChecklistenRoutes />} />
            <Route path="/app/tools/sop/*" element={<SopBibliothekRoutes />} />
            <Route path="/app/tools/vm-compliance/*" element={<VmComplianceRoutes />} />
            <Route path="/app/tools/store-standards/*" element={<StoreStandardsRoutes />} />

            {/* Performance & Sichtbarkeit */}
            <Route path="/app/tools/kpi/*" element={<KpiDashboardRoutes />} />
            <Route path="/app/tools/budget/*" element={<BudgetTrackerRoutes />} />
            <Route path="/app/tools/forecast/*" element={<ForecastRoutes />} />
            <Route path="/app/tools/loss-prevention/*" element={<LossPreventionRoutes />} />
            <Route path="/app/tools/inventory/*" element={<InventoryRoutes />} />

            {/* Floor in Echtzeit */}
            <Route path="/app/tools/live-floor/*" element={<LiveFloorRoutes />} />
            <Route path="/app/tools/fr-tracking/*" element={<FrTrackingRoutes />} />
            <Route path="/app/tools/vm-guidelines/*" element={<VmGuidelinesRoutes />} />
            <Route path="/app/tools/maintenance/*" element={<MaintenanceRoutes />} />

            {/* Training & Entwicklung */}
            <Route path="/app/tools/training-hub/*" element={<TrainingHubRoutes />} />
            <Route path="/app/tools/training-hours/*" element={<TrainingHoursRoutes />} />
            <Route path="/app/tools/challenges/*" element={<ChallengesRoutes />} />
            <Route path="/app/tools/onboarding/*" element={<OnboardingRoutes />} />

            {/* Coaching & People */}
            <Route path="/app/tools/coaching/*" element={<CoachingRoutes />} />
            <Route path="/app/tools/pdp-pip/*" element={<PdpPipRoutes />} />
            <Route path="/app/tools/appraisals/*" element={<AppraisalsRoutes />} />
            <Route path="/app/tools/shift-planning/*" element={<ShiftPlanningRoutes />} />
            <Route path="/app/tools/pulse-survey/*" element={<PulseSurveyRoutes />} />
            <Route path="/app/tools/wellbeing/*" element={<WellbeingRoutes />} />

            {/* Kommunikation & Signal */}
            <Route path="/app/tools/briefings/*" element={<BriefingsRoutes />} />
            <Route path="/app/tools/handover/*" element={<HandoverRoutes />} />
            <Route path="/app/tools/team-push/*" element={<TeamPushRoutes />} />
            <Route path="/app/tools/newsletter/*" element={<NewsletterRoutes />} />

            {/* Customer, Clienteling & Stock */}
            <Route path="/app/tools/fr-conversion/*" element={<FrConversionRoutes />} />
            <Route path="/app/tools/clienteling/*" element={<ClientelingRoutes />} />
            <Route path="/app/tools/stock-callouts/*" element={<StockCalloutsRoutes />} />
            <Route path="/app/tools/track-trace/*" element={<TrackTraceRoutes />} />

            {/* Regional Insights */}
            <Route path="/app/tools/multi-store/*" element={<MultiStoreRoutes />} />
            <Route path="/app/tools/rm-dashboard/*" element={<RmDashboardRoutes />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
