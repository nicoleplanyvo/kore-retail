import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { UserRole } from '@kore/types';
import {
  Shield,
  Users,
  BarChart3,
  Settings,
  Store,
  BookOpen,
  GraduationCap,
  Wrench,
  UserPlus,
  FileText,
  Map,
  Eye,
  CalendarDays,
  Heart,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Role metadata                                                      */
/* ------------------------------------------------------------------ */

const ROLE_LABELS: Record<UserRole, string> = {
  kore_admin: 'Plattform-Administrator',
  tenant_admin: 'Admin',
  regional_manager: 'Regional Manager',
  multisite_manager: 'Multisite Manager',
  store_manager: 'Store Manager',
  learner: 'Mitarbeiter',
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  kore_admin:
    'Du hast vollen Zugriff auf die gesamte KORE-Plattform. Du verwaltest Mandanten, Stores und kannst dich als jeder Benutzer anmelden, um Support zu leisten.',
  tenant_admin:
    'Du verwaltest Benutzer, Stores und Tool-Buchungen fuer dein Unternehmen. Ausserdem hast du Zugriff auf DSGVO-Einstellungen und uebergreifende Reports.',
  regional_manager:
    'Du hast Einblick in alle Stores deiner Region. Vergleiche Performance-Daten, manage dein Team und steuere Tool-Buchungen ueberregional.',
  multisite_manager:
    'Du betreust mehrere Stores gleichzeitig. Behalte den Ueberblick ueber alle Standorte, vergleiche Kennzahlen und koordiniere dein Team.',
  store_manager:
    'Du leitest deinen Store. Verwalte dein Team, nutze die zugewiesenen Tools und behalte Reports und Store-Einstellungen im Blick.',
  learner:
    'Willkommen im Team! Nutze die dir zugewiesenen Tools, starte dein Onboarding und arbeite an deinen Trainings.',
};

interface FeatureCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ROLE_FEATURES: Record<UserRole, FeatureCard[]> = {
  learner: [
    {
      icon: Wrench,
      title: 'Deine Tools',
      description: 'Alle Tools, die dir zugewiesen sind, auf einen Blick.',
    },
    {
      icon: UserPlus,
      title: 'Onboarding',
      description: 'Schritt fuer Schritt durch deinen Einstieg begleitet.',
    },
    {
      icon: GraduationCap,
      title: 'Training',
      description: 'Lerne neue Faehigkeiten mit interaktiven Kursen.',
    },
  ],
  store_manager: [
    {
      icon: Users,
      title: 'Team verwalten',
      description: 'Ueberblick ueber dein Team und Rollenzuweisungen.',
    },
    {
      icon: Wrench,
      title: 'Tools nutzen',
      description: 'Alle gebuchten Tools fuer deinen Store.',
    },
    {
      icon: BarChart3,
      title: 'Reports einsehen',
      description: 'Performance-Daten und Auswertungen deines Stores.',
    },
    {
      icon: Settings,
      title: 'Store-Einstellungen',
      description: 'Konfiguriere deinen Store nach deinen Beduerfnissen.',
    },
  ],
  multisite_manager: [
    {
      icon: Map,
      title: 'Multi-Store Vergleich',
      description: 'Vergleiche Kennzahlen aller deiner Standorte.',
    },
    {
      icon: Users,
      title: 'Team-Uebersicht',
      description: 'Alle Teams deiner Stores auf einen Blick.',
    },
    {
      icon: BarChart3,
      title: 'Reports',
      description: 'Uebergreifende Auswertungen und Trends.',
    },
    {
      icon: ShoppingBag,
      title: 'Store-Koordination',
      description: 'Koordiniere Aktionen und Prozesse standortuebergreifend.',
    },
  ],
  regional_manager: [
    {
      icon: Map,
      title: 'Multi-Store Vergleich',
      description: 'Vergleiche Performance-Daten ueber deine gesamte Region.',
    },
    {
      icon: Users,
      title: 'Team-Uebersicht',
      description: 'Alle Mitarbeiter deiner Region auf einen Blick.',
    },
    {
      icon: BarChart3,
      title: 'Reports',
      description: 'Regionale Auswertungen und Trend-Analysen.',
    },
    {
      icon: CalendarDays,
      title: 'Tool-Buchung',
      description: 'Buche und verwalte Tools fuer deine Stores.',
    },
  ],
  tenant_admin: [
    {
      icon: Users,
      title: 'Benutzer verwalten',
      description: 'Erstelle und verwalte alle Benutzer deines Unternehmens.',
    },
    {
      icon: Store,
      title: 'Stores',
      description: 'Verwalte alle Standorte und ihre Konfiguration.',
    },
    {
      icon: BookOpen,
      title: 'Tool-Buchung',
      description: 'Buche Tools und weise sie deinen Stores zu.',
    },
    {
      icon: FileText,
      title: 'DSGVO & Reporting',
      description: 'Datenschutz-Einstellungen und uebergreifende Reports.',
    },
  ],
  kore_admin: [
    {
      icon: Heart,
      title: 'Mandanten',
      description: 'Verwalte alle Mandanten der KORE-Plattform.',
    },
    {
      icon: Store,
      title: 'Alle Stores',
      description: 'Zugriff auf jeden Store ueber alle Mandanten.',
    },
    {
      icon: Settings,
      title: 'Plattform-Einstellungen',
      description: 'Globale Konfiguration und System-Verwaltung.',
    },
    {
      icon: Eye,
      title: 'Impersonation',
      description: 'Melde dich als jeder Benutzer an, um Support zu leisten.',
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function WelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const role = user?.role || 'learner';
  const firstName = user?.name?.split(' ')[0] || 'User';
  const features = ROLE_FEATURES[role] || ROLE_FEATURES.learner;

  const handleStart = () => {
    if (user?.id) {
      localStorage.setItem(`kore_welcomed_${user.id}`, 'true');
    }
    navigate('/app', { replace: true });
  };

  return (
    <div className="min-h-screen bg-kore-bg flex items-center justify-center px-md py-2xl">
      <div className="w-full max-w-[640px]">
        {/* Logo */}
        <div className="text-center mb-2xl">
          <h1 className="font-display text-h2 text-kore-ink tracking-wide">KORE</h1>
          <p className="font-body text-small text-kore-mid mt-xs">Retail Platform</p>
        </div>

        {/* Main card */}
        <div className="bg-kore-white border border-kore-border p-xl sm:p-2xl">
          {/* Greeting */}
          <div className="text-center mb-xl">
            <h2 className="font-display text-h2 sm:text-h1 text-kore-ink">
              Willkommen, {firstName}!
            </h2>

            {/* Role badge */}
            <div className="inline-flex items-center gap-sm mt-md px-md py-xs bg-kore-surface border border-kore-border">
              <Shield size={14} className="text-kore-brass" />
              <span className="font-body text-small text-kore-ink font-medium">
                {ROLE_LABELS[role]}
              </span>
            </div>

            {/* Role description */}
            <p className="font-body text-small text-kore-mid mt-lg max-w-[480px] mx-auto leading-relaxed">
              {ROLE_DESCRIPTIONS[role]}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-kore-border my-xl" />

          {/* Feature cards */}
          <div className="mb-xl">
            <h3 className="font-body text-caption text-kore-mid uppercase tracking-[0.14em] mb-lg text-center">
              Deine wichtigsten Funktionen
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="bg-kore-surface border border-kore-border p-lg flex items-start gap-md"
                  >
                    <div className="w-[36px] h-[36px] bg-kore-white flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-kore-brass" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-body text-small text-kore-ink font-medium">
                        {feature.title}
                      </p>
                      <p className="font-body text-[0.75rem] text-kore-mid mt-xs leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleStart}
            className="w-full bg-kore-ink text-kore-white font-body text-small font-medium py-md px-lg hover:bg-kore-mid transition-colors tracking-wide"
          >
            Los geht's
          </button>
        </div>
      </div>
    </div>
  );
}
