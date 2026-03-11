import { NavLink } from 'react-router-dom';
import {
  Home, Building2, Wrench, Store, Shield, Users, GitBranch, LogOut, X,
  ClipboardCheck, Award, TrendingUp, Camera, BookOpen, BarChart3, Wallet,
  LineChart, Package, Monitor, Activity, Palette, GraduationCap,
  Clock, Trophy, UserPlus, MessageSquare, Compass, Star, CalendarDays,
  Heart, Smile, FileText, ArrowLeftRight, Bell, Mail, Navigation,
  Map, LayoutDashboard, PackageSearch, type LucideIcon,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { hasMinRole, type UserRole } from '@kore/types';
import { useMyTools } from '../hooks/useMyTools';
import { api } from '../lib/api';

// Icon-Mapping: icon-String aus DB -> Lucide-Komponente
const iconMap: Record<string, LucideIcon> = {
  ClipboardCheck, Award, TrendingUp, Camera, BookOpen,
  BarChart3, Wallet, LineChart, Shield, Package,
  Monitor, Activity, Palette, Wrench,
  GraduationCap, Clock, Trophy, UserPlus,
  MessageSquare, Compass, Star, CalendarDays, Heart, Smile,
  FileText, ArrowLeftRight, Bell, Mail,
  Users, PackageSearch, Navigation,
  Map, LayoutDashboard,
};

// Tool-Key -> Route-Mapping (nur Tools mit registrierter Route)
const toolRoutes: Record<string, string> = {
  'standards.excellence_tracker': '/tools/sea',
  // Weitere Tools hier registrieren wenn implementiert
};

interface AdminNavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  minRole: UserRole;
}

const adminItems: AdminNavItem[] = [
  { to: '/admin/users', icon: Users, label: 'Benutzer', minRole: 'store_manager' },
  { to: '/admin/stores', icon: Store, label: 'Stores', minRole: 'store_manager' },
  { to: '/admin/tools', icon: Wrench, label: 'Tool-Katalog', minRole: 'regional_manager' },
  { to: '/admin/reporting', icon: GitBranch, label: 'Organisation', minRole: 'tenant_admin' },
  { to: '/admin/gdpr', icon: Shield, label: 'DSGVO', minRole: 'tenant_admin' },
  { to: '/admin/tenants', icon: Building2, label: 'Mandanten', minRole: 'kore_admin' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, clearAuth } = useAuthStore();
  const userRole = (user?.role || 'learner') as UserRole;
  const { data: myTools } = useMyTools();

  // Admin-Items basierend auf Rolle filtern
  const visibleAdminItems = adminItems.filter((item) =>
    hasMinRole(userRole, item.minRole),
  );

  // Tool-Items: nur Tools mit registrierter Route anzeigen
  const toolNavItems = (myTools || [])
    .filter((assignment) => toolRoutes[assignment.tool.key])
    .map((assignment) => ({
      key: assignment.tool.key,
      to: toolRoutes[assignment.tool.key]!,
      icon: iconMap[assignment.tool.icon || ''] || Wrench,
      label: assignment.tool.name,
    }));

  const handleLogout = async () => {
    try {
      await api('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignoriere Fehler beim Logout
    }
    clearAuth();
  };

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-md-sm px-md py-md-sm rounded-sm mb-xs transition-colors duration-200 ${
      isActive
        ? 'bg-white/10 text-kore-brass-lt'
        : 'text-kore-faint hover:text-kore-white hover:bg-white/5'
    }`;

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
          fixed inset-y-0 left-0 z-50 w-[240px] bg-kore-ink flex flex-col flex-shrink-0
          transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo + Close on mobile */}
        <div className="px-lg py-xl border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="font-display text-h3 text-kore-white tracking-wider">KORE</h1>
            <p className="font-body text-[0.65rem] text-kore-faint uppercase tracking-[0.16em] mt-xs">
              Retail Platform
            </p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-kore-faint hover:text-kore-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-lg px-md-sm overflow-y-auto">
          {/* Sektion 1: Home */}
          <NavLink
            to="/"
            end
            onClick={onClose}
            className={linkClasses}
          >
            <Home size={18} />
            <span className="font-body text-small font-normal">Home</span>
          </NavLink>

          {/* Sektion 2: Meine Tools (dynamisch) */}
          {toolNavItems.length > 0 && (
            <>
              <p className="font-body text-[0.6rem] text-kore-faint/50 uppercase tracking-[0.16em] px-md mt-lg mb-xs">
                Meine Tools
              </p>
              {toolNavItems.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.to}
                  onClick={onClose}
                  className={linkClasses}
                >
                  <item.icon size={18} />
                  <span className="font-body text-small font-normal">{item.label}</span>
                </NavLink>
              ))}
            </>
          )}

          {/* Sektion 3: Verwaltung (rollenbasiert) */}
          {visibleAdminItems.length > 0 && (
            <>
              <p className="font-body text-[0.6rem] text-kore-faint/50 uppercase tracking-[0.16em] px-md mt-lg mb-xs">
                Verwaltung
              </p>
              {visibleAdminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={linkClasses}
                >
                  <item.icon size={18} />
                  <span className="font-body text-small font-normal">{item.label}</span>
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* User Info + Logout */}
        <div className="px-md-sm py-lg border-t border-white/10">
          {user && (
            <div className="px-md mb-md">
              <p className="font-body text-[0.7rem] text-kore-faint truncate">{user.name}</p>
              <p className="font-body text-[0.6rem] text-kore-faint/60 truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-md-sm px-md py-md-sm text-kore-faint hover:text-kore-error transition-colors duration-200 w-full font-body text-small"
          >
            <LogOut size={18} />
            <span>Abmelden</span>
          </button>
        </div>
      </aside>
    </>
  );
}
