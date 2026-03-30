import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import {
  useUnreadNotificationCount,
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '../hooks/useNotifications';
import type { AppNotification } from '@kore/types';

/* ── Helper ─────────────────────────────────────────────────── */

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'Gerade eben';
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `vor ${days} Tag${days === 1 ? '' : 'en'}`;
  const months = Math.floor(days / 30);
  return `vor ${months} Monat${months === 1 ? '' : 'en'}`;
}

/* ── Component ──────────────────────────────────────────────── */

export function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: countData } = useUnreadNotificationCount();
  const { data: listData } = useNotifications(1, false);
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const unreadCount = countData?.count ?? 0;
  const notifications: AppNotification[] = listData?.data?.slice(0, 10) ?? [];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function handleNotificationClick(n: AppNotification) {
    if (!n.isRead) {
      markRead.mutate(n.id);
    }
    setOpen(false);
    if (n.link) {
      navigate(n.link);
    }
  }

  function handleMarkAll() {
    markAll.mutate();
  }

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-[36px] h-[36px] flex items-center justify-center rounded-sm hover:bg-kore-surface transition-colors"
        aria-label="Benachrichtigungen"
      >
        <Bell size={20} className="text-kore-ink" />
        {unreadCount > 0 && (
          <span className="absolute top-[4px] right-[4px] min-w-[16px] h-[16px] px-[3px] flex items-center justify-center rounded-full bg-kore-brass text-white text-[10px] font-medium leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-[44px] w-[360px] bg-kore-white border border-kore-border shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-lg py-md border-b border-kore-border">
            <span className="font-body text-small font-medium text-kore-ink uppercase tracking-widest">
              Benachrichtigungen
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                disabled={markAll.isPending}
                className="text-caption text-kore-mid hover:text-kore-ink transition-colors disabled:opacity-50"
              >
                Alle als gelesen markieren
              </button>
            )}
          </div>

          {/* Notification list */}
          {notifications.length === 0 ? (
            <div className="px-lg py-xl text-center text-small text-kore-mid">
              Keine Benachrichtigungen
            </div>
          ) : (
            <ul className="max-h-[400px] overflow-y-auto divide-y divide-kore-border">
              {notifications.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => handleNotificationClick(n)}
                    className={`w-full text-left px-lg py-md hover:bg-kore-faint transition-colors flex items-start gap-md ${
                      !n.isRead ? 'bg-kore-surface' : ''
                    }`}
                  >
                    {/* Unread dot */}
                    <span className="mt-[6px] flex-shrink-0 w-[7px] h-[7px] rounded-full bg-kore-brass"
                      style={{ opacity: n.isRead ? 0 : 1 }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-small text-kore-ink leading-snug truncate ${!n.isRead ? 'font-medium' : ''}`}>
                        {n.title}
                      </p>
                      <p className="text-caption text-kore-mid mt-[2px]">
                        {formatRelativeTime(n.createdAt)}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Footer */}
          <div className="border-t border-kore-border px-lg py-md">
            <Link
              to="/app/notifications"
              onClick={() => setOpen(false)}
              className="block text-center text-caption text-kore-mid hover:text-kore-ink uppercase tracking-widest transition-colors"
            >
              Alle Benachrichtigungen
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
