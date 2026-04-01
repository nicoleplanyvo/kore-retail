import { NavLink } from 'react-router-dom';
import {
  Home, Wrench, LogOut, X, PanelLeftClose, PanelLeftOpen,
  ClipboardCheck, Award, TrendingUp, Camera, BookOpen, BarChart3, Wallet,
  LineChart, Package, Monitor, Activity, Palette, GraduationCap,
  Clock, Trophy, UserPlus, MessageSquare, Compass, Star, CalendarDays,
  Heart, Smile, FileText, ArrowLeftRight, Bell, Mail, Navigation,
  Map, LayoutDashboard, PackageSearch, Shield, Users, User, Paintbrush, type LucideIcon,
} from 'lucide-react';
import { useUnreadCount } from '../hooks/useMessaging';
import { useAuthStore } from '../stores/authStore';
import { useMyTools } from '../hooks/useMyTools';
import { TOOL_ROUTES } from '../lib/toolRoutes';
import { api } from '../lib/api';

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

// Kategorie-Reihenfolge
const categoryOrder = [
  'STANDARDS_COMPLIANCE',
  'PERFORMANCE',
  'FLOOR',
  'TRAINING',
  'COACHING_PEOPLE',
  'KOMMUNIKATION',
  'CUSTOMER_STOCK',
  'REGIONAL_INSIGHTS',
];

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function AppSidebar({ open, onClose, collapsed, onToggleCollapse }: AppSidebarProps) {
  const { user, clearAuth } = useAuthStore();
  const { data: myTools } = useMyTools();
  const { data: unreadCount } = useUnreadCount();

  const branding = user?.tenantBranding;
  const hasTenantLogo = !!branding?.logoUrl;
  const tenantPrimary = branding?.primaryColor;

  // Tool-Items nach Kategorie gruppieren
  const toolsByCategory: Record<string, Array<{
    key: string;
    to: string;
    icon: LucideIcon;
    label: string;
  }>> = {};

  for (const assignment of myTools || []) {
    const route = TOOL_ROUTES[assignment.tool.key];
    if (!route) continue;
    const cat = assignment.tool.category;
    if (!toolsByCategory[cat]) toolsByCategory[cat] = [];
    toolsByCategory[cat]!.push({
      key: assignment.tool.key,
      to: route,
      icon: iconMap[assignment.tool.icon || ''] || Wrench,
      label: assignment.tool.name,
    });
  }

  const handleLogout = async () => {
    try {
      await api('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignoriere Fehler beim Logout
    }
    clearAuth();
  };

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-md-sm py-md-sm rounded-sm mb-xs transition-colors duration-200 ${
      collapsed ? 'px-0 justify-center' : 'px-md'
    } ${
      isActive
        ? `bg-white/10 ${tenantPrimary ? '' : 'text-kore-brass-lt'}`
        : 'text-kore-faint hover:text-kore-white hover:bg-white/5'
    }`;

  const activeLinkStyle = tenantPrimary ? { color: tenantPrimary } : undefined;

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-kore-ink flex flex-col flex-shrink-0
          transition-all duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'lg:w-16' : 'lg:w-[240px]'}
          w-[240px]
        `}
      >
        {/* Logo + Close on mobile */}
        <div className={`py-xl border-b border-white/10 flex items-center justify-between ${collapsed ? 'px-md' : 'px-lg'}`}>
          <div className="flex items-center gap-md min-w-0">
            {hasTenantLogo ? (
              <img
                src={`/api/uploads/${branding!.logoUrl}`}
                alt={branding?.tenantName || 'Logo'}
                className={`h-8 w-auto object-contain ${collapsed ? 'max-w-[32px]' : 'max-w-[120px]'}`}
              />
            ) : (
              <div className="overflow-hidden">
                <h1 className={`font-display text-kore-white tracking-wider transition-all duration-200 ${collapsed ? 'text-small text-center' : 'text-h3'}`}>
                  {collapsed ? 'K' : 'KORE'}
                </h1>
                <p className={`font-body text-[0.65rem] text-kore-faint uppercase tracking-[0.16em] mt-xs transition-opacity duration-200 ${collapsed ? 'opacity-0 h-0 mt-0' : 'opacity-100'}`}>
                  {branding?.tenantName || 'Retail Platform'}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-kore-faint hover:text-kore-white transition-colors p-1"
            aria-label="Seitenleiste schließen"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-lg overflow-y-auto ${collapsed ? 'px-xs' : 'px-md-sm'}`} role="navigation" aria-label="Hauptnavigation">
          {/* Home */}
          <NavLink
            to="/app"
            end
            onClick={onClose}
            className={linkClasses}
            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
            title={collapsed ? 'Home' : undefined}
          >
            <Home size={18} className="flex-shrink-0" />
            <span className={`font-body text-small font-normal whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}`}>Home</span>
          </NavLink>

          {/* Platform Features */}
          <p className={`font-body text-[0.6rem] text-kore-faint/50 uppercase tracking-[0.16em] px-md mt-lg mb-xs transition-opacity duration-200 ${collapsed ? 'lg:opacity-0 lg:h-0 lg:mt-0 lg:mb-0 lg:overflow-hidden' : 'opacity-100'}`}>
            Platform
          </p>
          <NavLink to="/app/messaging" onClick={onClose} className={linkClasses} style={({ isActive }) => isActive ? activeLinkStyle : undefined} title={collapsed ? 'Nachrichten' : undefined}>
            <span className="relative flex-shrink-0">
              <MessageSquare size={18} />
              {collapsed && (unreadCount ?? 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ backgroundColor: tenantPrimary || 'rgb(59 130 246)' }} />
              )}
            </span>
            <span className={`font-body text-small font-normal flex-1 whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}`}>Nachrichten</span>
            {!collapsed && (unreadCount ?? 0) > 0 && (
              <span className="text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1"
                style={{ backgroundColor: tenantPrimary || 'rgb(59 130 246)' }}>
                {unreadCount! > 99 ? '99+' : unreadCount}
              </span>
            )}
          </NavLink>
          <NavLink to="/app/orgchart" onClick={onClose} className={linkClasses} style={({ isActive }) => isActive ? activeLinkStyle : undefined} title={collapsed ? 'Organigramm' : undefined}>
            <Users size={18} className="flex-shrink-0" />
            <span className={`font-body text-small font-normal whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}`}>Organigramm</span>
          </NavLink>
          <NavLink to="/app/profile" onClick={onClose} className={linkClasses} style={({ isActive }) => isActive ? activeLinkStyle : undefined} title={collapsed ? 'Mein Profil' : undefined}>
            <User size={18} className="flex-shrink-0" />
            <span className={`font-body text-small font-normal whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}`}>Mein Profil</span>
          </NavLink>
          {(user?.role === 'tenant_admin' || user?.role === 'kore_admin') && (
            <NavLink to="/app/branding" onClick={onClose} className={linkClasses} style={({ isActive }) => isActive ? activeLinkStyle : undefined} title={collapsed ? 'Branding' : undefined}>
              <Paintbrush size={18} className="flex-shrink-0" />
              <span className={`font-body text-small font-normal whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}`}>Branding</span>
            </NavLink>
          )}
          {user?.role === 'kore_admin' && (
            <NavLink to="/app/admin/onboarding" onClick={onClose} className={linkClasses} style={({ isActive }) => isActive ? activeLinkStyle : undefined} title={collapsed ? 'Tenant einrichten' : undefined}>
              <UserPlus size={18} className="flex-shrink-0" />
              <span className={`font-body text-small font-normal whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}`}>Tenant einrichten</span>
            </NavLink>
          )}

          {/* Tools nach Kategorie */}
          {categoryOrder
            .filter((cat) => toolsByCategory[cat]?.length)
            .map((cat) => (
              <div key={cat}>
                <p className={`font-body text-[0.6rem] text-kore-faint/50 uppercase tracking-[0.16em] px-md mt-lg mb-xs transition-opacity duration-200 ${collapsed ? 'lg:opacity-0 lg:h-0 lg:mt-0 lg:mb-0 lg:overflow-hidden' : 'opacity-100'}`}>
                  {categoryLabels[cat] || cat}
                </p>
                {toolsByCategory[cat]!.map((item) => (
                  <NavLink
                    key={item.key}
                    to={item.to}
                    onClick={onClose}
                    className={linkClasses}
                    style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon size={18} className="flex-shrink-0" />
                    <span className={`font-body text-small font-normal whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}`}>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            ))}
        </nav>

        {/* User Info + Logout */}
        <div className={`py-lg border-t border-white/10 ${collapsed ? 'px-xs' : 'px-md-sm'}`}>
          {user && !collapsed && (
            <div className="px-md mb-md">
              <p className="font-body text-[0.7rem] text-kore-faint truncate">{user.name}</p>
              <p className="font-body text-[0.6rem] text-kore-faint/60 truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-md-sm py-md-sm text-kore-faint hover:text-kore-error transition-colors duration-200 w-full font-body text-small ${collapsed ? 'justify-center px-0' : 'px-md'}`}
            title={collapsed ? 'Abmelden' : undefined}
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className={`whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}`}>Abmelden</span>
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-full py-md-sm mt-xs text-kore-faint hover:text-kore-white transition-colors duration-200 rounded-sm hover:bg-white/5"
            aria-label={collapsed ? 'Seitenleiste erweitern' : 'Seitenleiste einklappen'}
            title={collapsed ? 'Seitenleiste erweitern' : 'Seitenleiste einklappen'}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}
