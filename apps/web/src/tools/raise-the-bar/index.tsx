import { Routes, Route } from 'react-router-dom';
import { RankingPage } from './pages/RankingPage';
import { SettingsPage } from './pages/SettingsPage';
import { DataEntryPage } from './pages/DataEntryPage';
import { ImportPage } from './pages/ImportPage';
import { ComparisonPage } from './pages/ComparisonPage';

export default function RaiseTheBarRoutes() {
  return (
    <Routes>
      <Route index element={<RankingPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="data-entry" element={<DataEntryPage />} />
      <Route path="import" element={<ImportPage />} />
      <Route path="comparison" element={<ComparisonPage />} />
    </Routes>
  );
}
