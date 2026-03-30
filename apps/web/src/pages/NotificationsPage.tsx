import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Info,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../hooks/useNotifications';
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

function TypeIcon({ type }: { type: string }) {
  const cls = 'flex-shrink-0';
  switch (type) {
    case 'audit_completed':
      return <CheckCircle size={18} className={`${cls} text-emerald-500`} />;
    case 'message_received':
      return <MessageSquare size={18} className={`${cls} text-kore-brass`} />;
    case 'invite_accepted':
      return <CheckCircle size={18} className={`${cls} text-kore-brass`} />;
    case 'alert':
    case 'warning':
      return <AlertTriangle size={18} className={`${cls} text-amber-500`} />;
    default:
      return <Info size={18} className={`${cls} text-kore-mid`} />;
  }
}

/* ── Component ──────────────────────────────────────────────── */

export function NotificationsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const { data, isLoading } = useNotifications(page, unreadOnly);
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const notifications: AppNotification[] = data?.data ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 20;
  const totalPages = Math.ceil(total / pageSize);

  function handleNotificationClick(n: AppNotification) {
    if (!n.isRead) {
      markRead.mutate(n.id);
    }
    if (n.link) {
      navigate(n.link);
    }
  }

  function handleUnreadToggle() {
    setUnreadOnly((v) => !v);
    setPage(1);
  }

  return (
    <div className="p-xl max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-2xl flex-wrap gap-md">
        <div>
          <div className="flex items-center gap-md mb-xs">
            <Bell size={24} className="text-kore-brass" />
            <h1 className="font-display text-h1 text-kore-ink">Benachrichtigungen</h1>
          </div>
          <p className="text-body text-kore-mid">
            Alle Meldungen und Updates auf einen Blick
          </p>
        </div>
        <button
          onClick={() => markAll.mutate()}
          disabled={markAll.isPending || notifications.every((n) => n.isRead)}
          className="flex items-center gap-sm border border-kore-border px-lg py-md-sm text-small font-medium uppercase tracking-widest text-kore-ink hover:bg-kore-bg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Alle als gelesen markieren
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-md mb-xl">
        <label className="flex items-center gap-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={handleUnreadToggle}
            className="w-4 h-4 accent-kore-brass"
          />
          <span className="text-small text-kore-ink">Nur ungelesene</span>
        </label>
        {total > 0 && (
          <span className="text-caption text-kore-mid ml-auto">
            {total} {total === 1 ? 'Benachrichtigung' : 'Benachrichtigungen'}
          </span>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-body text-kore-mid py-xl">Lade Benachrichtigungen...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-kore-white border border-kore-border p-3xl flex flex-col items-center text-center">
          <Bell size={48} className="text-kore-faint mb-lg" />
          <h2 className="font-display text-h2 text-kore-ink mb-md">
            {unreadOnly ? 'Keine ungelesenen Benachrichtigungen' : 'Keine Benachrichtigungen'}
          </h2>
          <p className="text-body text-kore-mid max-w-sm">
            {unreadOnly
              ? 'Alle Meldungen wurden bereits gelesen.'
              : 'Hier erscheinen zukünftige Meldungen und Updates.'}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-kore-white border border-kore-border divide-y divide-kore-border">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`flex items-start gap-lg px-lg py-md cursor-pointer hover:bg-kore-bg transition-colors ${
                  !n.isRead ? 'border-l-2 border-l-kore-brass bg-kore-surface' : ''
                }`}
              >
                <div className="mt-[2px]">
                  <TypeIcon type={n.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-small text-kore-ink ${!n.isRead ? 'font-medium' : ''}`}>
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="text-caption text-kore-mid mt-xs line-clamp-2">{n.body}</p>
                  )}
                  <p className="text-caption text-kore-faint mt-xs">
                    {formatRelativeTime(n.createdAt)}
                  </p>
                </div>
                {!n.isRead && (
                  <span className="mt-[8px] flex-shrink-0 w-[8px] h-[8px] rounded-full bg-kore-brass" />
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-xl">
              <span className="text-small text-kore-mid">
                {total} {total === 1 ? 'Benachrichtigung' : 'Benachrichtigungen'} &middot; Seite {page} von {totalPages}
              </span>
              <div className="flex gap-sm">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-sm border border-kore-border hover:bg-kore-bg disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-sm border border-kore-border hover:bg-kore-bg disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
