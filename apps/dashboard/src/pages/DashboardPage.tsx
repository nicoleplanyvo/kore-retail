import {
  Building2, Store, Wrench, TrendingUp, Euro,
  ClipboardCheck, Award, Camera, BookOpen, BarChart3, Wallet,
  LineChart, Package, Monitor, Activity, Palette, GraduationCap,
  Clock, Trophy, UserPlus, MessageSquare, Compass, Star, CalendarDays,
  Heart, Smile, FileText, ArrowLeftRight, Bell, Mail, Navigation,
  Map, LayoutDashboard, PackageSearch, Shield, type LucideIcon,
} from 'lucide-react';
import { useDashboardStats, useTenants } from '../hooks/useTenants';
import { useMyTools } from '../hooks/useMyTools';
import { useAuthStore } from '../stores/authStore';
import { hasMinRole, type UserRole } from '@kore/types';
import { Badge } from '@kore/ui';
import { useNavigate } from 'react-router-dom';
import t from '../locales/de.json';

// Icon-Mapping: icon-String aus DB -> Lucide-Komponente
const iconMap: Record<string, LucideIcon> = {
  ClipboardCheck, Award, TrendingUp, Camera, BookOpen,
  BarChart3, Wallet, LineChart, Shield, Package,
  Monitor, Activity, Palette, Wrench,
  GraduationCap, Clock, Trophy, UserPlus,
  MessageSquare, Compass, Star, CalendarDays, Heart, Smile,
  FileText, ArrowLeftRight, Bell, Mail,
  PackageSearch, Navigation,
  Map, LayoutDashboard,
};

// Tool-Key -> Route-Mapping (nur Tools mit Route)
const toolRoutes: Record<string, string> = {
  'standards.excellence_tracker': '/tools/sea',
};

// Kategorie-Labels
const categoryLabels: Record<string, string> = {
  STANDARDS_COMPLIANCE: 'Standards & Compliance',
  PERFORMANCE: 'Performance & Sichtbarkeit',
  FLOOR: 'Floor in Echtzeit',
  TRAINING: 'Training & Entwicklung',
  COACHING_PEOPLE: 'Coaching & People',
  KOMMUNIKATION: 'Kommunikation & Signal',
  CUSTOMER_STOCK: 'Customer, Clienteling & Stock',
  REGIONAL_INSIGHTS: 'Regional Insights',
};

function StatsCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="bg-kore-white border border-kore-border p-xl flex items-start gap-lg">
      <div
        className="w-[44px] h-[44px] flex items-center justify-center flex-shrink-0"
        style={{ background: color || 'var(--kore-surface)' }}
      >
        <Icon size={20} className="text-kore-ink" />
      </div>
      <div>
        <p className="font-body text-caption text-kore-mid uppercase tracking-[0.14em]">{label}</p>
        <p className="font-display text-h2 text-kore-ink mt-xs">{value}</p>
      </div>
    </div>
  );
}

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'brass'> = {
  ACTIVE: 'success',
  PAST_DUE: 'warning',
  CANCELED: 'error',
  TRIALING: 'brass',
};

/** kore_admin Dashboard: Plattform-Stats + Recent Tenants */
function KoreAdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentTenants } = useTenants({ page: 1, pageSize: 5 });
  const navigate = useNavigate();

  const formatMrr = (cents: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg mb-2xl">
        <StatsCard
          icon={Building2}
          label={t.dashboard.totalTenants}
          value={statsLoading ? '...' : stats?.totalTenants ?? 0}
        />
        <StatsCard
          icon={Store}
          label={t.dashboard.totalStores}
          value={statsLoading ? '...' : stats?.totalStores ?? 0}
          color="rgba(107, 140, 107, 0.1)"
        />
        <StatsCard
          icon={Wrench}
          label={t.dashboard.totalToolBookings}
          value={statsLoading ? '...' : stats?.totalToolBookings ?? 0}
          color="rgba(158, 132, 96, 0.1)"
        />
        <StatsCard
          icon={TrendingUp}
          label={t.dashboard.activeTenants}
          value={statsLoading ? '...' : stats?.activeTenants ?? 0}
        />
        <StatsCard
          icon={Store}
          label={t.dashboard.activeStores}
          value={statsLoading ? '...' : stats?.activeStores ?? 0}
          color="rgba(107, 140, 107, 0.1)"
        />
        <StatsCard
          icon={Euro}
          label={t.dashboard.mrr}
          value={statsLoading ? '...' : formatMrr(stats?.mrr ?? 0)}
          color="rgba(158, 132, 96, 0.15)"
        />
      </div>

      <div className="bg-kore-white border border-kore-border">
        <div className="px-xl py-lg border-b border-kore-border">
          <h2 className="font-display text-h3 text-kore-ink">{t.dashboard.recentTenants}</h2>
        </div>
        <div className="divide-y divide-kore-border">
          {recentTenants?.data.map((tenant) => (
            <div
              key={tenant.id}
              className="px-md sm:px-xl py-md flex items-start sm:items-center justify-between gap-md cursor-pointer hover:bg-kore-surface transition-colors"
              onClick={() => navigate(`/admin/tenants/${tenant.id}`)}
            >
              <div className="min-w-0">
                <p className="font-body text-body text-kore-ink font-normal truncate">{tenant.name}</p>
                <p className="font-body text-small text-kore-mid">{tenant.slug}</p>
              </div>
              <div className="flex items-center gap-xs sm:gap-md-sm flex-wrap justify-end flex-shrink-0">
                <Badge variant={statusVariant[tenant.status] ?? 'neutral'}>
                  {t.status[tenant.status as keyof typeof t.status]}
                </Badge>
                <span className="text-small text-kore-mid">
                  {tenant._count?.stores ?? 0} Stores
                </span>
              </div>
            </div>
          ))}
          {recentTenants?.data.length === 0 && (
            <p className="px-xl py-lg text-kore-mid font-body text-small">{t.tenants.empty}</p>
          )}
        </div>
      </div>
    </>
  );
}

/** Tool-Cards Grid für alle Rollen */
function ToolCardsGrid() {
  const { data: myTools, isLoading } = useMyTools();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="py-xl text-center">
        <p className="font-body text-kore-mid">Tools werden geladen...</p>
      </div>
    );
  }

  if (!myTools || myTools.length === 0) {
    return (
      <div className="bg-kore-white border border-kore-border p-2xl text-center">
        <Wrench size={32} className="text-kore-mid/30 mx-auto mb-md" />
        <p className="font-body text-kore-mid">Keine Tools zugewiesen.</p>
        <p className="font-body text-small text-kore-mid/60 mt-xs">
          Kontaktieren Sie Ihren Administrator, um Tools freizuschalten.
        </p>
      </div>
    );
  }

  // Gruppiere nach Kategorie
  const grouped: Record<string, typeof myTools> = {};
  for (const assignment of myTools) {
    const cat = assignment.tool.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat]!.push(assignment);
  }

  return (
    <div className="space-y-xl">
      {Object.entries(grouped).map(([category, assignments]) => (
        <div key={category}>
          <h3 className="font-body text-caption text-kore-mid uppercase tracking-[0.14em] mb-md">
            {categoryLabels[category] || category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
            {assignments.map((assignment) => {
              const tool = assignment.tool;
              const Icon = iconMap[tool.icon || ''] || Wrench;
              const route = toolRoutes[tool.key];

              return (
                <div
                  key={tool.id}
                  className={`bg-kore-white border border-kore-border p-lg flex items-start gap-md transition-colors ${
                    route
                      ? 'cursor-pointer hover:border-kore-brass/40 hover:bg-kore-surface'
                      : 'opacity-60'
                  }`}
                  onClick={() => route && navigate(route)}
                >
                  <div className="w-[36px] h-[36px] bg-kore-surface flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-kore-ink" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-small text-kore-ink font-normal truncate">
                      {tool.name}
                    </p>
                    {tool.description && (
                      <p className="font-body text-[0.65rem] text-kore-mid mt-xs line-clamp-2">
                        {tool.description}
                      </p>
                    )}
                    {!route && (
                      <p className="font-body text-[0.6rem] text-kore-brass mt-xs">
                        Bald verfügbar
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuthStore();
  const userRole = (user?.role || 'learner') as UserRole;

  // Rollenbasierter Greeting
  const roleLabels: Record<string, string> = {
    kore_admin: 'Plattform-Admin',
    tenant_admin: 'Administrator',
    regional_manager: 'Regional Manager',
    multisite_manager: 'Multisite Manager',
    store_manager: 'Store Manager',
    learner: 'Mitarbeiter',
  };

  return (
    <div>
      {/* Header mit Begrüßung */}
      <div className="mb-lg sm:mb-xl">
        <h1 className="font-display text-h2 sm:text-h1 text-kore-ink">
          Hallo, {user?.name?.split(' ')[0] || 'User'}
        </h1>
        <p className="font-body text-small text-kore-mid mt-xs">
          {roleLabels[userRole] || userRole}
          {user?.tenantId && ' — '}
        </p>
      </div>

      {/* kore_admin: Plattform-Stats */}
      {userRole === 'kore_admin' && <KoreAdminDashboard />}

      {/* Alle Rollen: Tool-Cards */}
      <div className={userRole === 'kore_admin' ? 'mt-2xl' : ''}>
        <h2 className="font-display text-h3 text-kore-ink mb-lg">
          {hasMinRole(userRole, 'store_manager') ? 'Meine Tools' : 'Verfügbare Tools'}
        </h2>
        <ToolCardsGrid />
      </div>
    </div>
  );
}
