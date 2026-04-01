import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const ROLE_LABELS: Record<string, string> = {
  kore_admin: 'Super Admin',
  tenant_admin: 'Admin',
  regional_manager: 'Regional Manager',
  multisite_manager: 'Multisite Manager',
  store_manager: 'Store Manager',
  learner: 'Mitarbeiter',
};

export function AccessDeniedPage() {
  const { user } = useAuthStore();
  return (
    <div className="min-h-screen bg-kore-bg">
      <div className="h-[56px] bg-kore-white border-b border-kore-border flex items-center px-xl">
        <Link to="/app" className="font-display text-h3 text-kore-ink tracking-wider">KORE</Link>
      </div>
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <div className="text-center max-w-[400px] px-md">
          <div className="w-[56px] h-[56px] bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={28} className="text-red-500" />
          </div>
          <h1 className="font-display text-2xl text-kore-ink mb-2">Zugriff verweigert</h1>
          <p className="font-body text-sm text-kore-mid mb-3">
            Du hast nicht die erforderliche Berechtigung, um auf diesen Bereich zuzugreifen.
          </p>
          {user && (
            <p className="font-body text-xs text-kore-mid/60 mb-8">
              Deine aktuelle Rolle: <span className="font-medium">{ROLE_LABELS[user.role] || user.role}</span>
            </p>
          )}
          <Link
            to="/app"
            className="inline-flex items-center gap-2 font-body text-sm text-kore-brass hover:text-kore-brass-dk transition-colors"
          >
            <ArrowLeft size={16} />
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    </div>
  );
}
