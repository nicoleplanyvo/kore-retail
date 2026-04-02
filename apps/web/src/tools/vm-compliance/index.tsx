import { Routes, Route, Navigate } from 'react-router-dom';
import { OverviewPage } from './pages/OverviewPage';
import { CheckDetailPage } from './pages/CheckDetailPage';
import { SubmitPage } from './pages/SubmitPage';
import { DashboardPage } from './pages/DashboardPage';
import { GuidelinesPage } from './pages/GuidelinesPage';

export default function VmComplianceRoutes() {
  return (
    <Routes>
      <Route index element={<OverviewPage />} />
      <Route path="checks/:id" element={<CheckDetailPage />} />
      <Route path="submit" element={<SubmitPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="guidelines" element={<GuidelinesPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
