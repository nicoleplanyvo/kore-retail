import { Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { HomePage } from './pages/HomePage';
import { ConsultingPage } from './pages/ConsultingPage';
import { TrainingPage } from './pages/TrainingPage';
import { SuitePage } from './pages/SuitePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuditPage } from './pages/AuditPage';
import { LegalPage } from './pages/LegalPage';
import { useAnalytics } from './hooks/useAnalytics';
import { ScrollToTop } from './components/ScrollToTop';

export function App() {
  useAnalytics();

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/consulting" element={<ConsultingPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/suite" element={<SuitePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/legal" element={<LegalPage />} />
        </Route>
      </Routes>
    </>
  );
}
