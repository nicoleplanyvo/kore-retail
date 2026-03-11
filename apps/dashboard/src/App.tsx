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
