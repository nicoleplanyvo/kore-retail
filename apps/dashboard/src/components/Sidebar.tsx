import { NavLink } from 'react-router-dom';
import {
  Home, Building2, Wrench, Store, Shield, Users, GitBranch, LogOut, X,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { hasMinRole, type UserRole } from '@kore/types';
import { api } from '../lib/api';
import type { LucideIcon } from 'lucide-react';

interface AdminNavItem {
  to: string;
  icon: LucideIcon;
  label: string;
  minRole: UserRole;
}

const adminItems: AdminNavItem[] = [
  { to: '/admin/users', icon: Users, label: 'Benutzer', minRole: 'store_manager' },
  { to: '/admin/stores', icon: Store, label: 'Stores', minRole: 'store_manager' },
  { to: '/admin/tools', icon: Wrench, label: 'Tool-Buchung', minRole: 'regional_manager' },
  { to: '/admin/reporting', icon: GitBranch, label: 'Organisation', minRole: 'tenant_admin' },
  { to: '/admin/gdpr', icon: Shield, label: 'DSGVO', minRole: 'tenant_admin' },
  { to: '/admin/tenants', icon: Building2, label: 'Mandanten', minRole: 'kore_admin' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ open, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const { user, clearAuth } = useAuthStore();
  const userRole = (user?.role || 'learner') as UserRole;

  // Admin-Items basierend auf Rolle filtern
  const visibleAdminItems = adminItems.filter((item) =>
    hasMinRole(userRole, item.minRole),
  );

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
          <div className="overflow-hidden">
            <h1 className={`font-display text-kore-white tracking-wider transition-all duration-200 ${collapsed ? 'text-small text-center' : 'text-h3'}`}>
              {collapsed ? 'K' : 'KORE'}
            </h1>
            <p className={`font-body text-[0.65rem] text-kore-faint uppercase tracking-[0.16em] mt-xs transition-opacity duration-200 ${collapsed ? 'opacity-0 h-0 mt-0 overflow-hidden' : 'opacity-100'}`}>
              Dashboard
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
        <nav className={`flex-1 py-lg overflow-y-auto ${collapsed ? 'px-xs' : 'px-md-sm'}`}>
          {/* Home */}
          <NavLink
            to="/"
            end
            onClick={onClose}
            className={linkClasses}
            title={collapsed ? 'Home' : undefined}
          >
            <Home size={18} className="flex-shrink-0" />
            <span className={`font-body text-small font-normal whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}`}>Home</span>
          </NavLink>

          {/* Verwaltung (rollenbasiert) */}
          {visibleAdminItems.length > 0 && (
            <>
              <p className={`font-body text-[0.6rem] text-kore-faint/50 uppercase tracking-[0.16em] px-md mt-lg mb-xs transition-opacity duration-200 ${collapsed ? 'lg:opacity-0 lg:h-0 lg:mt-0 lg:mb-0 lg:overflow-hidden' : 'opacity-100'}`}>
                Verwaltung
              </p>
              {visibleAdminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={linkClasses}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18} className="flex-shrink-0" />
                  <span className={`font-body text-small font-normal whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}`}>{item.label}</span>
                </NavLink>
              ))}
            </>
          )}
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
