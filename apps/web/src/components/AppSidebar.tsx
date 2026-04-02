import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, Wrench, LogOut, X, ChevronLeft, ChevronRight, User, MessageCircle,
  ClipboardCheck, Award, TrendingUp, Camera, BookOpen, BarChart3, Wallet,
  LineChart, Package, Monitor, Activity, Palette, GraduationCap,
  Clock, Trophy, UserPlus, MessageSquare, Compass, Star, CalendarDays,
  Heart, Smile, FileText, ArrowLeftRight, Bell, Mail, Navigation,
  Map, LayoutDashboard, PackageSearch, Shield, type LucideIcon,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useMyTools } from '../hooks/useMyTools';
import { TOOL_ROUTES } from '../lib/toolRoutes';
import { api, API_URL } from '../lib/api';

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
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const { user, clearAuth } = useAuthStore();
  const { data: myTools } = useMyTools();
  const [collapsed, setCollapsed] = useState(false);

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

  // Alle NavLinks verwenden identische Klassen fuer gleichmaessige Icon-Zentrierung
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    collapsed
      ? `flex items-center justify-center w-[40px] h-[40px] mx-auto rounded-sm mb-xs transition-colors duration-200 ${
          isActive
            ? 'bg-white/10 text-kore-brass-lt'
            : 'text-kore-faint hover:text-kore-white hover:bg-white/5'
        }`
      : `flex items-center gap-md-sm px-md py-md-sm rounded-sm mb-xs transition-colors duration-200 ${
          isActive
            ? 'bg-white/10 text-kore-brass-lt'
            : 'text-kore-faint hover:text-kore-white hover:bg-white/5'
        }`;

  const sidebarWidth = collapsed ? 'w-[64px]' : 'w-[240px]';

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
          fixed inset-y-0 left-0 z-50 ${sidebarWidth} bg-kore-ink flex flex-col flex-shrink-0
          transform transition-all duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo + Close on mobile + Collapse toggle */}
        <div className={`border-b border-white/10 flex items-center ${collapsed ? 'justify-center px-sm py-lg' : 'justify-between px-lg py-xl'}`}>
          {collapsed ? (
            <div className="flex flex-col items-center gap-xs">
              {user?.tenantBranding?.logoUrl ? (
                <img
                  src={`${API_URL}/api/uploads/${user.tenantBranding.logoUrl}`}
                  alt={user.tenantBranding.tenantName}
                  className="h-[24px] w-auto max-w-[40px] object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <span className="font-display text-body text-kore-white tracking-wider">K</span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-md min-w-0">
              {user?.tenantBranding?.logoUrl ? (
                <img
                  src={`${API_URL}/api/uploads/${user.tenantBranding.logoUrl}`}
                  alt={user.tenantBranding.tenantName}
                  className="h-[32px] w-auto max-w-[80px] object-contain flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : null}
              <div className="min-w-0">
                <h1 className="font-display text-h3 text-kore-white tracking-wider leading-tight">
                  {user?.tenantBranding?.tenantName ?? 'KORE'}
                </h1>
                <p className="font-body text-[0.65rem] text-kore-faint uppercase tracking-[0.16em] mt-xs">
                  Retail Platform
                </p>
              </div>
            </div>
          )}
          {/* Close button — only on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden text-kore-faint hover:text-kore-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-lg overflow-y-auto ${collapsed ? 'px-sm' : 'px-md-sm'}`}>
          {/* Home */}
          <NavLink
            to="/app"
            end
            onClick={onClose}
            className={linkClasses}
            title={collapsed ? 'Home' : undefined}
          >
            <Home size={18} className="flex-shrink-0" />
            {!collapsed && <span className="font-body text-small font-normal">Home</span>}
          </NavLink>

          {/* Tools nach Kategorie */}
          {categoryOrder
            .filter((cat) => toolsByCategory[cat]?.length)
            .map((cat) => (
              <div key={cat}>
                {!collapsed && (
                  <p className="font-body text-[0.6rem] text-kore-faint/50 uppercase tracking-[0.16em] px-md mt-lg mb-xs">
                    {categoryLabels[cat] || cat}
                  </p>
                )}
                {collapsed && <div className="mt-md mb-xs border-t border-white/5" />}
                {toolsByCategory[cat]!.map((item) => (
                  <NavLink
                    key={item.key}
                    to={item.to}
                    onClick={onClose}
                    className={linkClasses}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon size={18} className="flex-shrink-0" />
                    {!collapsed && <span className="font-body text-small font-normal">{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            ))}
        </nav>

        {/* Collapse Toggle — nur Desktop */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="hidden lg:flex items-center justify-center h-[36px] border-t border-white/10 text-kore-faint hover:text-kore-white transition-colors"
          aria-label={collapsed ? 'Seitenleiste erweitern' : 'Seitenleiste einklappen'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* User Info + Logout */}
        <div className={`border-t border-white/10 ${collapsed ? 'px-sm py-md' : 'px-md-sm py-lg'}`}>
          {/* Profile & Messaging links */}
          <NavLink
            to="/app/messaging"
            onClick={onClose}
            className={linkClasses}
            title={collapsed ? 'Nachrichten' : undefined}
          >
            <MessageCircle size={18} className="flex-shrink-0" />
            {!collapsed && <span className="font-body text-small font-normal">Nachrichten</span>}
          </NavLink>
          <NavLink
            to="/app/profile"
            onClick={onClose}
            className={linkClasses}
            title={collapsed ? 'Profil' : undefined}
          >
            <User size={18} className="flex-shrink-0" />
            {!collapsed && <span className="font-body text-small font-normal">Profil</span>}
          </NavLink>

          {user && !collapsed && (
            <div className="px-md mb-md mt-md">
              <p className="font-body text-[0.7rem] text-kore-faint truncate">{user.name}</p>
              <p className="font-body text-[0.6rem] text-kore-faint/60 truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={
              collapsed
                ? 'flex items-center justify-center w-[40px] h-[40px] mx-auto text-kore-faint hover:text-kore-error transition-colors duration-200'
                : 'flex items-center gap-md-sm px-md py-md-sm text-kore-faint hover:text-kore-error transition-colors duration-200 w-full font-body text-small'
            }
            title={collapsed ? 'Abmelden' : undefined}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>Abmelden</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
