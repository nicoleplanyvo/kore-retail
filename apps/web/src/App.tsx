import { lazy, Suspense, type ReactNode } from 'react';
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
import { AcceptInvitePage } from './pages/AcceptInvitePage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ToolsHomePage } from './pages/ToolsHomePage';
import { ProfilePage } from './pages/ProfilePage';
import { OrgchartPage } from './pages/OrgchartPage';
import MessagingPage from './pages/MessagingPage';
import { BrandingPage } from './pages/BrandingPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OnboardingWizardPage } from './pages/admin/OnboardingWizardPage';
import { ReportsExportPage } from './pages/admin/ReportsExportPage';
import { useAnalytics } from './hooks/useAnalytics';
import { ScrollToTop } from './components/ScrollToTop';
import { ListPageSkeleton } from './components/Skeleton';

// Lazy-loaded Tool-Routes (Code Splitting)
function ToolSuspense({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="p-6"><ListPageSkeleton /></div>}>{children}</Suspense>;
}

const StoreExcellenceAuditRoutes = lazy(() => import('./tools/store-excellence-audit/index'));
const ChecklistenRoutes = lazy(() => import('./tools/checklisten/index'));
const SopBibliothekRoutes = lazy(() => import('./tools/sop-bibliothek/index'));
const VmComplianceRoutes = lazy(() => import('./tools/vm-compliance/index'));
const StoreStandardsRoutes = lazy(() => import('./tools/store-standards/index'));
const KpiDashboardRoutes = lazy(() => import('./tools/kpi-dashboard/index'));
const BudgetTrackerRoutes = lazy(() => import('./tools/budget-tracker/index'));
const ForecastRoutes = lazy(() => import('./tools/forecast/index'));
const LossPreventionRoutes = lazy(() => import('./tools/loss-prevention/index'));
const InventoryRoutes = lazy(() => import('./tools/inventory/index'));
const LiveFloorRoutes = lazy(() => import('./tools/live-floor/index'));
const FrTrackingRoutes = lazy(() => import('./tools/fr-tracking/index'));
const VmGuidelinesRoutes = lazy(() => import('./tools/vm-guidelines/index'));
const MaintenanceRoutes = lazy(() => import('./tools/maintenance/index'));
const TrainingHubRoutes = lazy(() => import('./tools/training-hub/index'));
const TrainingHoursRoutes = lazy(() => import('./tools/training-hours/index'));
const ChallengesRoutes = lazy(() => import('./tools/challenges/index'));
const OnboardingRoutes = lazy(() => import('./tools/onboarding/index'));
const CoachingRoutes = lazy(() => import('./tools/coaching/index'));
const PdpPipRoutes = lazy(() => import('./tools/pdp-pip/index'));
const AppraisalsRoutes = lazy(() => import('./tools/appraisals/index'));
const ShiftPlanningRoutes = lazy(() => import('./tools/shift-planning/index'));
const PulseSurveyRoutes = lazy(() => import('./tools/pulse-survey/index'));
const WellbeingRoutes = lazy(() => import('./tools/wellbeing/index'));
const BriefingsRoutes = lazy(() => import('./tools/briefings/index'));
const HandoverRoutes = lazy(() => import('./tools/handover/index'));
const TeamPushRoutes = lazy(() => import('./tools/team-push/index'));
const NewsletterRoutes = lazy(() => import('./tools/newsletter/index'));
const FrConversionRoutes = lazy(() => import('./tools/fr-conversion/index'));
const ClientelingRoutes = lazy(() => import('./tools/clienteling/index'));
const StockCalloutsRoutes = lazy(() => import('./tools/stock-callouts/index'));
const TrackTraceRoutes = lazy(() => import('./tools/track-trace/index'));
const MultiStoreRoutes = lazy(() => import('./tools/multi-store/index'));
const RmDashboardRoutes = lazy(() => import('./tools/rm-dashboard/index'));

export function App() {
  useAnalytics();

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Marketing-Seiten (öffentlich) */}
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

        {/* Auth-Seiten (öffentlich) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/invite/:token" element={<AcceptInvitePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* Geschützter App-Bereich */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Home — Alle authentifizierten User */}
            <Route path="/app" element={<ToolsHomePage />} />
            <Route path="/app/profile" element={<ProfilePage />} />
            <Route path="/app/orgchart" element={<OrgchartPage />} />
            <Route path="/app/messaging" element={<MessagingPage />} />
            <Route path="/app/notifications" element={<NotificationsPage />} />

            {/* Standards & Compliance */}
            <Route path="/app/tools/sea/*" element={<ToolSuspense><StoreExcellenceAuditRoutes /></ToolSuspense>} />
            <Route path="/app/tools/checklisten/*" element={<ToolSuspense><ChecklistenRoutes /></ToolSuspense>} />
            <Route path="/app/tools/sop/*" element={<ToolSuspense><SopBibliothekRoutes /></ToolSuspense>} />
            <Route path="/app/tools/vm-compliance/*" element={<ToolSuspense><VmComplianceRoutes /></ToolSuspense>} />
            <Route path="/app/tools/store-standards/*" element={<ToolSuspense><StoreStandardsRoutes /></ToolSuspense>} />

            {/* Performance & Sichtbarkeit */}
            <Route path="/app/tools/kpi/*" element={<ToolSuspense><KpiDashboardRoutes /></ToolSuspense>} />
            <Route path="/app/tools/budget/*" element={<ToolSuspense><BudgetTrackerRoutes /></ToolSuspense>} />
            <Route path="/app/tools/forecast/*" element={<ToolSuspense><ForecastRoutes /></ToolSuspense>} />
            <Route path="/app/tools/loss-prevention/*" element={<ToolSuspense><LossPreventionRoutes /></ToolSuspense>} />
            <Route path="/app/tools/inventory/*" element={<ToolSuspense><InventoryRoutes /></ToolSuspense>} />

            {/* Floor in Echtzeit */}
            <Route path="/app/tools/live-floor/*" element={<ToolSuspense><LiveFloorRoutes /></ToolSuspense>} />
            <Route path="/app/tools/fr-tracking/*" element={<ToolSuspense><FrTrackingRoutes /></ToolSuspense>} />
            <Route path="/app/tools/vm-guidelines/*" element={<ToolSuspense><VmGuidelinesRoutes /></ToolSuspense>} />
            <Route path="/app/tools/maintenance/*" element={<ToolSuspense><MaintenanceRoutes /></ToolSuspense>} />

            {/* Training & Entwicklung */}
            <Route path="/app/tools/training-hub/*" element={<ToolSuspense><TrainingHubRoutes /></ToolSuspense>} />
            <Route path="/app/tools/training-hours/*" element={<ToolSuspense><TrainingHoursRoutes /></ToolSuspense>} />
            <Route path="/app/tools/challenges/*" element={<ToolSuspense><ChallengesRoutes /></ToolSuspense>} />
            <Route path="/app/tools/onboarding/*" element={<ToolSuspense><OnboardingRoutes /></ToolSuspense>} />

            {/* Coaching & People */}
            <Route path="/app/tools/coaching/*" element={<ToolSuspense><CoachingRoutes /></ToolSuspense>} />
            <Route path="/app/tools/pdp-pip/*" element={<ToolSuspense><PdpPipRoutes /></ToolSuspense>} />
            <Route path="/app/tools/appraisals/*" element={<ToolSuspense><AppraisalsRoutes /></ToolSuspense>} />
            <Route path="/app/tools/shift-planning/*" element={<ToolSuspense><ShiftPlanningRoutes /></ToolSuspense>} />
            <Route path="/app/tools/pulse-survey/*" element={<ToolSuspense><PulseSurveyRoutes /></ToolSuspense>} />
            <Route path="/app/tools/wellbeing/*" element={<ToolSuspense><WellbeingRoutes /></ToolSuspense>} />

            {/* Kommunikation & Signal */}
            <Route path="/app/tools/briefings/*" element={<ToolSuspense><BriefingsRoutes /></ToolSuspense>} />
            <Route path="/app/tools/handover/*" element={<ToolSuspense><HandoverRoutes /></ToolSuspense>} />
            <Route path="/app/tools/team-push/*" element={<ToolSuspense><TeamPushRoutes /></ToolSuspense>} />
            <Route path="/app/tools/newsletter/*" element={<ToolSuspense><NewsletterRoutes /></ToolSuspense>} />

            {/* Customer, Clienteling & Stock */}
            <Route path="/app/tools/fr-conversion/*" element={<ToolSuspense><FrConversionRoutes /></ToolSuspense>} />
            <Route path="/app/tools/clienteling/*" element={<ToolSuspense><ClientelingRoutes /></ToolSuspense>} />
            <Route path="/app/tools/stock-callouts/*" element={<ToolSuspense><StockCalloutsRoutes /></ToolSuspense>} />
            <Route path="/app/tools/track-trace/*" element={<ToolSuspense><TrackTraceRoutes /></ToolSuspense>} />

            {/* Regional Insights */}
            <Route path="/app/tools/multi-store/*" element={<ToolSuspense><MultiStoreRoutes /></ToolSuspense>} />
            <Route path="/app/tools/rm-dashboard/*" element={<ToolSuspense><RmDashboardRoutes /></ToolSuspense>} />
          </Route>
        </Route>

        {/* Berichte & Export — store_manager+ */}
        <Route element={<ProtectedRoute minRole="store_manager" />}>
          <Route element={<AppLayout />}>
            <Route path="/app/admin/reports" element={<ReportsExportPage />} />
          </Route>
        </Route>

        {/* Branding — nur tenant_admin + kore_admin */}
        <Route element={<ProtectedRoute minRole="tenant_admin" />}>
          <Route element={<AppLayout />}>
            <Route path="/app/branding" element={<BrandingPage />} />
          </Route>
        </Route>

        {/* Admin — nur kore_admin */}
        <Route element={<ProtectedRoute allowedRoles={['kore_admin']} />}>
          <Route element={<AppLayout />}>
            <Route path="/app/admin/onboarding" element={<OnboardingWizardPage />} />
          </Route>
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
