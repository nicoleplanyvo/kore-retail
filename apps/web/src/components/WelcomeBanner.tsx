import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface RoleConfig {
  description: string;
  quickLinks: { label: string; path: string }[];
}

const ROLE_CONFIGS: Record<string, RoleConfig> = {
  learner: {
    description: 'Als Mitarbeiter hast du Zugriff auf deine zugewiesenen Tools, Trainings und Checklisten.',
    quickLinks: [
      { label: 'Meine Tools', path: '/app' },
      { label: 'Trainings', path: '/app/tools/training-hub' },
    ],
  },
  store_manager: {
    description: 'Als Store Manager verwaltest du dein Team, KPIs und Store-Standards.',
    quickLinks: [
      { label: 'KPI Dashboard', path: '/app/tools/kpi' },
      { label: 'Schichtplanung', path: '/app/tools/shift-planning' },
      { label: 'Store Audit', path: '/app/tools/sea' },
    ],
  },
  multisite_manager: {
    description: 'Als Multisite Manager hast du Einblick in mehrere Stores und deren Performance.',
    quickLinks: [
      { label: 'Multi-Store', path: '/app/tools/multi-store' },
      { label: 'KPI Dashboard', path: '/app/tools/kpi' },
    ],
  },
  regional_manager: {
    description: 'Als Regional Manager steuerst du die Performance deiner Region und Teams.',
    quickLinks: [
      { label: 'RM Dashboard', path: '/app/tools/rm-dashboard' },
      { label: 'Multi-Store', path: '/app/tools/multi-store' },
    ],
  },
  tenant_admin: {
    description: 'Als Kunden-Admin verwaltest du Benutzer, Stores und Tool-Zuweisungen fuer deinen Mandanten.',
    quickLinks: [
      { label: 'Meine Tools', path: '/app' },
    ],
  },
  kore_admin: {
    description: 'Als Super Admin hast du vollen Zugriff auf alle Bereiche der Plattform.',
    quickLinks: [
      { label: 'Alle Tools', path: '/app' },
    ],
  },
};

const ROLE_LABELS: Record<string, string> = {
  kore_admin: 'Super Admin',
  tenant_admin: 'Kunden-Admin',
  regional_manager: 'Regional Manager',
  multisite_manager: 'Multisite Manager',
  store_manager: 'Store Manager',
  learner: 'Mitarbeiter',
};

export function WelcomeBanner() {
  const { user } = useAuthStore();
  const storageKey = `kore_welcomed_v1_${user?.id}`;
  const [dismissed, setDismissed] = useState(() => {
    if (!user) return true;
    return localStorage.getItem(storageKey) === '1';
  });

  if (dismissed || !user) return null;

  const config = ROLE_CONFIGS[user.role];
  if (!config) return null;

  const firstName = user.name?.split(' ')[0] || user.name || 'User';

  function dismiss() {
    localStorage.setItem(storageKey, '1');
    setDismissed(true);
  }

  return (
    <div className="relative bg-white border border-amber-200/60 rounded-lg p-5 mb-6 border-l-[3px] border-l-amber-600">
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Schliessen"
      >
        <X size={18} />
      </button>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles size={18} className="text-amber-600" />
        </div>
        <div className="flex-1 pr-6">
          <h3 className="font-display text-lg text-gray-900 mb-1">
            Willkommen, {firstName}!
          </h3>
          <p className="text-xs font-medium uppercase tracking-widest text-amber-700 mb-2">
            {ROLE_LABELS[user.role] || user.role}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            {config.description}
          </p>
          {config.quickLinks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {config.quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
