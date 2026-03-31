import { Routes, Route } from 'react-router-dom';
import { OverviewPage } from './pages/OverviewPage';
import { NewEvaluationPage } from './pages/NewEvaluationPage';
import { EvaluationDetailPage } from './pages/EvaluationDetailPage';

export default function StoreStandardsRoutes() {
  return (
    <Routes>
      <Route index element={<OverviewPage />} />
      <Route path="new" element={<NewEvaluationPage />} />
      <Route path=":id" element={<EvaluationDetailPage />} />
    </Routes>
  );
}
