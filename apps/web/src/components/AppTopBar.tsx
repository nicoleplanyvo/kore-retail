import { User, Menu, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useUnreadCount } from '../hooks/useMessaging';
import { NotificationBell } from './NotificationBell';

const ROLE_CONFIG: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  kore_admin:        { label: 'Admin',         dot: 'bg-kore-brass',    bg: 'bg-kore-brass/10',    text: 'text-kore-brass-dk' },
  tenant_admin:      { label: 'Kunden-Admin',  dot: 'bg-purple-500',    bg: 'bg-purple-500/10',    text: 'text-purple-700' },
  regional_manager:  { label: 'Regional',      dot: 'bg-blue-500',      bg: 'bg-blue-500/10',      text: 'text-blue-700' },
  multisite_manager: { label: 'Multisite',     dot: 'bg-teal-500',      bg: 'bg-teal-500/10',      text: 'text-teal-700' },
  store_manager:     { label: 'Store Manager', dot: 'bg-kore-success',  bg: 'bg-kore-success/10',  text: 'text-kore-success' },
  learner:           { label: 'Mitarbeiter',   dot: 'bg-kore-mid',      bg: 'bg-kore-surface',     text: 'text-kore-mid' },
};

interface AppTopBarProps {
  onMenuToggle: () => void;
}

export function AppTopBar({ onMenuToggle }: AppTopBarProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: unreadCount } = useUnreadCount();
  const roleCfg = ROLE_CONFIG[user?.role || ''];

  return (
    <header className="h-[56px] bg-kore-white border-b border-kore-border flex items-center justify-between px-md sm:px-xl flex-shrink-0" role="banner">
      <button
        onClick={onMenuToggle}
        className="lg:hidden w-[36px] h-[36px] flex items-center justify-center rounded-sm hover:bg-kore-surface transition-colors"
        aria-label="Menue oeffnen"
      >
        <Menu size={20} className="text-kore-ink" />
      </button>

      {/* Spacer for desktop (no hamburger) */}
      <div className="hidden lg:block" />

      <div className="flex items-center gap-md-sm">
        {/* Notifications */}
        <NotificationBell />
        {/* Messages shortcut */}
        <button
          onClick={() => navigate('/app/messaging')}
          className="relative w-[36px] h-[36px] flex items-center justify-center rounded-sm hover:bg-kore-surface transition-colors"
          aria-label="Nachrichten"
        >
          <MessageSquare size={18} className="text-kore-mid" />
          {(unreadCount ?? 0) > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 text-white text-[9px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1"
              style={{ backgroundColor: user?.tenantBranding?.primaryColor || 'rgb(59 130 246)' }}
            >
              {unreadCount! > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        {/* Role Badge */}
        {roleCfg && (
          <span className={`hidden sm:inline-flex items-center gap-[5px] rounded-full px-2 py-0.5 font-body text-xs font-medium ${roleCfg.bg} ${roleCfg.text}`}>
            <span className={`inline-block w-[6px] h-[6px] rounded-full ${roleCfg.dot}`} />
            {roleCfg.label}
          </span>
        )}
        <button onClick={() => navigate('/app/profile')} className="w-[32px] h-[32px] rounded-full bg-kore-surface flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-kore-brass/30 transition-all">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User size={16} className="text-kore-mid" />
          )}
        </button>
        <span className="font-body text-small text-kore-ink hidden sm:inline">{user?.name}</span>
      </div>
    </header>
  );
}
