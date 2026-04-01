import { Routes, Route } from 'react-router-dom';
import { OverviewPage } from './pages/OverviewPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { CreateTemplatePage } from './pages/CreateTemplatePage';
import { SessionDetailPage } from './pages/SessionDetailPage';
import { ConductPage } from './pages/ConductPage';
import { DashboardPage } from './pages/DashboardPage';

export default function ChecklistenAuditsRoutes() {
  return (
    <Routes>
      <Route index element={<OverviewPage />} />
      <Route path="templates" element={<TemplatesPage />} />
      <Route path="templates/new" element={<CreateTemplatePage />} />
      <Route path="sessions/:id" element={<SessionDetailPage />} />
      <Route path="sessions/:id/conduct" element={<ConductPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
    </Routes>
  );
}
