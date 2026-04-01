import { useState, useMemo } from 'react';
import { Search, UserX, AlertTriangle, Loader2 } from 'lucide-react';
import { Modal } from '../../components/Modal';
import type { OrgUser } from '../../hooks/useOrgchart';
import { OrgAvatar } from './OrgAvatar';
import { ROLE_LABELS, ROLE_ORDER } from './constants';

interface ManagerModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly targetUser: OrgUser | null;
  readonly allUsers: readonly OrgUser[];
  readonly onSelectManager: (managerId: string | null) => void;
  readonly isPending: boolean;
  readonly errorMessage: string | null;
}

export function ManagerModal({
  isOpen,
  onClose,
  targetUser,
  allUsers,
  onSelectManager,
  isPending,
  errorMessage,
}: ManagerModalProps) {
  const [search, setSearch] = useState('');

  // Filter out the target user and sort candidates by role then name
  const candidates = useMemo(() => {
    if (!targetUser) return [];

    const filtered = allUsers.filter((u) => {
      if (u.id === targetUser.id) return false;
      if (!search) return true;
      const query = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        (ROLE_LABELS[u.role] ?? u.role).toLowerCase().includes(query)
      );
    });

    return [...filtered].sort((a, b) => {
      const roleA = ROLE_ORDER[a.role] ?? 99;
      const roleB = ROLE_ORDER[b.role] ?? 99;
      if (roleA !== roleB) return roleA - roleB;
      return a.name.localeCompare(b.name, 'de');
    });
  }, [allUsers, targetUser, search]);

  // Reset search when modal opens/closes
  const handleClose = () => {
    setSearch('');
    onClose();
  };

  if (!targetUser) return null;

  const currentManagerName =
    targetUser.managerId
      ? allUsers.find((u) => u.id === targetUser.managerId)?.name ?? 'Unbekannt'
      : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Vorgesetzten zuweisen: ${targetUser.name}`}
      size="md"
    >
      <div className="space-y-4">
        {/* Current manager info */}
        {currentManagerName && (
          <div className="flex items-center justify-between bg-kore-surface/50 rounded-lg px-3 py-2">
            <span className="text-xs text-kore-mid">
              Aktueller Vorgesetzter: <strong className="text-kore-ink">{currentManagerName}</strong>
            </span>
            <button
              onClick={() => onSelectManager(null)}
              disabled={isPending}
              className="
                inline-flex items-center gap-1 px-2 py-1
                text-xs text-red-600 hover:text-red-700
                bg-red-50 hover:bg-red-100
                rounded transition-colors
                disabled:opacity-50
              "
            >
              <UserX size={12} />
              Entfernen
            </button>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-700">{errorMessage}</p>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-kore-mid" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mitarbeiter suchen..."
            className="
              w-full pl-8 pr-3 py-2 text-sm
              border border-kore-border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-kore-brass/30 focus:border-kore-brass
              bg-white placeholder:text-kore-mid/60
            "
            autoFocus
          />
        </div>

        {/* Candidate list */}
        <div className="max-h-72 overflow-y-auto -mx-1 px-1 space-y-1">
          {candidates.length === 0 ? (
            <p className="text-xs text-kore-mid text-center py-6">
              {search ? 'Keine Mitarbeiter gefunden.' : 'Keine weiteren Mitarbeiter vorhanden.'}
            </p>
          ) : (
            candidates.map((candidate) => {
              const isCurrentManager = candidate.id === targetUser.managerId;
              return (
                <button
                  key={candidate.id}
                  onClick={() => onSelectManager(candidate.id)}
                  disabled={isPending || isCurrentManager}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                    transition-colors
                    ${
                      isCurrentManager
                        ? 'bg-kore-brass/5 border border-kore-brass/20 cursor-default'
                        : 'hover:bg-kore-surface/70 border border-transparent'
                    }
                    disabled:opacity-50
                  `}
                >
                  <OrgAvatar user={candidate} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-kore-ink truncate">
                      {candidate.name}
                    </p>
                    <p className="text-[0.65rem] text-kore-mid truncate">
                      {ROLE_LABELS[candidate.role] ?? candidate.role}
                      {candidate.storeNames.length > 0 && (
                        <> &middot; {candidate.storeNames.join(', ')}</>
                      )}
                    </p>
                  </div>
                  {isCurrentManager && (
                    <span className="text-[0.6rem] text-kore-brass font-medium px-1.5 py-0.5 bg-kore-brass/10 rounded">
                      Aktuell
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Loading overlay */}
        {isPending && (
          <div className="flex items-center justify-center gap-2 py-2">
            <Loader2 size={14} className="animate-spin text-kore-brass" />
            <span className="text-xs text-kore-mid">Wird gespeichert...</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
