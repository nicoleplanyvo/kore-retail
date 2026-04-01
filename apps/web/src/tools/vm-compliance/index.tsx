import { Routes, Route, Navigate } from 'react-router-dom';
import { OverviewPage } from './pages/OverviewPage';
import { CheckDetailPage } from './pages/CheckDetailPage';
import { SubmitPage } from './pages/SubmitPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReviewPage } from './pages/ReviewPage';
import { AreasSettingsPage } from './pages/AreasSettingsPage';

export default function VmComplianceRoutes() {
  return (
    <Routes>
      <Route index element={<OverviewPage />} />
      <Route path="checks/:id" element={<CheckDetailPage />} />
      <Route path="submit" element={<SubmitPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="review" element={<ReviewPage />} />
      <Route path="areas" element={<AreasSettingsPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
