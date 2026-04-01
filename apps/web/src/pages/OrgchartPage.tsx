import { useState, useCallback, useMemo } from 'react';
import { Users, Pencil, X, Network } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { useOrgchart, useSetManager, type OrgUser } from '../hooks/useOrgchart';
import { useAuthStore } from '../stores/authStore';
import { hasMinRole, type UserRole } from '@kore/types';
import { OrgchartSkeleton } from './orgchart/OrgchartSkeleton';
import { OrgNode } from './orgchart/OrgNode';
import { ManagerModal } from './orgchart/ManagerModal';
import { buildOrgTree } from './orgchart/buildTree';

// ── Main page ─────────────────────────────────────────────
export function OrgchartPage() {
  const { data: users, isLoading, error } = useOrgchart();
  const setManagerMutation = useSetManager();
  const { user: authUser } = useAuthStore();

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  // Can this user edit the org chart?
  const canEdit = authUser
    ? hasMinRole(authUser.role as UserRole, 'tenant_admin')
    : false;

  // Build tree from flat list
  const tree = useMemo(() => {
    if (!users || users.length === 0) return [];
    return buildOrgTree(users);
  }, [users]);

  // Check if any reporting lines exist
  const hasReportingLines = useMemo(() => {
    if (!users) return false;
    return users.some((u) => u.managerId !== null);
  }, [users]);

  // Find the user being edited
  const targetUser: OrgUser | null = useMemo(() => {
    if (!selectedUserId || !users) return null;
    return users.find((u) => u.id === selectedUserId) ?? null;
  }, [selectedUserId, users]);

  const handleToggleEdit = useCallback(() => {
    setIsEditMode((prev) => !prev);
    setSelectedUserId(null);
    setMutationError(null);
  }, []);

  const handleAssignManager = useCallback((userId: string) => {
    setSelectedUserId(userId);
    setMutationError(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedUserId(null);
    setMutationError(null);
  }, []);

  const handleSelectManager = useCallback(
    (managerId: string | null) => {
      if (!selectedUserId) return;
      setMutationError(null);

      setManagerMutation.mutate(
        { userId: selectedUserId, managerId },
        {
          onSuccess: () => {
            setSelectedUserId(null);
          },
          onError: (err: Error) => {
            setMutationError(err.message || 'Fehler beim Zuweisen des Vorgesetzten.');
          },
        },
      );
    },
    [selectedUserId, setManagerMutation],
  );

  // Count stats
  const stats = useMemo(() => {
    if (!users) return { total: 0, withManager: 0, roots: 0 };
    const withManager = users.filter((u) => u.managerId !== null).length;
    return {
      total: users.length,
      withManager,
      roots: users.length - withManager,
    };
  }, [users]);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Organigramm' }]} />

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-kore-surface flex items-center justify-center rounded-lg flex-shrink-0">
            <Users size={20} className="text-kore-ink" />
          </div>
          <div>
            <h1 className="font-display text-h2 sm:text-h1 text-kore-ink">Organigramm</h1>
            <p className="font-body text-small text-kore-mid">
              Teamstruktur und Berichtslinien auf einen Blick
            </p>
          </div>
        </div>

        {/* Edit toggle (only for tenant_admin+) */}
        {canEdit && !isLoading && users && users.length > 0 && (
          <button
            onClick={handleToggleEdit}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${
                isEditMode
                  ? 'bg-kore-ink text-white hover:bg-kore-ink/90'
                  : 'bg-white border border-kore-border text-kore-ink hover:bg-kore-surface/50'
              }
            `}
          >
            {isEditMode ? (
              <>
                <X size={16} />
                Bearbeitung beenden
              </>
            ) : (
              <>
                <Pencil size={16} />
                Bearbeiten
              </>
            )}
          </button>
        )}
      </div>

      {/* Stats bar */}
      {!isLoading && users && users.length > 0 && (
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="bg-white border border-kore-border rounded-lg px-4 py-2.5 flex items-center gap-2">
            <span className="text-xs text-kore-mid">Mitarbeiter</span>
            <span className="text-sm font-semibold text-kore-ink">{stats.total}</span>
          </div>
          <div className="bg-white border border-kore-border rounded-lg px-4 py-2.5 flex items-center gap-2">
            <span className="text-xs text-kore-mid">Mit Vorgesetztem</span>
            <span className="text-sm font-semibold text-kore-ink">{stats.withManager}</span>
          </div>
          <div className="bg-white border border-kore-border rounded-lg px-4 py-2.5 flex items-center gap-2">
            <span className="text-xs text-kore-mid">Ohne Zuordnung</span>
            <span className="text-sm font-semibold text-kore-ink">{stats.roots}</span>
          </div>
        </div>
      )}

      {/* Edit mode banner */}
      {isEditMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-6 flex items-start gap-3">
          <Pencil size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Bearbeitungsmodus aktiv</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Klicken Sie auf &quot;Vorgesetzten zuweisen&quot; bei einem Mitarbeiter, um die Berichtslinie zu definieren.
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <OrgchartSkeleton />
      ) : error ? (
        <div className="bg-white border border-red-200 rounded-lg p-8 text-center">
          <p className="font-body text-sm text-red-600">
            Organigramm konnte nicht geladen werden. Bitte versuchen Sie es erneut.
          </p>
        </div>
      ) : !users || users.length === 0 ? (
        <div className="bg-white border border-kore-border rounded-lg p-8 text-center">
          <Users size={36} className="text-kore-mid/30 mx-auto mb-3" />
          <p className="font-body text-kore-mid">Keine Mitarbeiter gefunden.</p>
        </div>
      ) : !hasReportingLines && !isEditMode ? (
        /* Empty state: users exist but no reporting lines */
        <div className="bg-white border border-kore-border rounded-lg p-12 text-center">
          <Network size={48} className="text-kore-mid/20 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-kore-ink mb-2">
            Keine Reporting-Struktur definiert
          </h2>
          <p className="text-sm text-kore-mid max-w-md mx-auto mb-5">
            Es wurden noch keine Berichtslinien festgelegt.
            {canEdit && ' Klicken Sie auf "Bearbeiten", um Vorgesetzte zuzuweisen und die Teamstruktur aufzubauen.'}
          </p>
          {canEdit && (
            <button
              onClick={handleToggleEdit}
              className="
                inline-flex items-center gap-2 px-5 py-2.5
                bg-kore-ink text-white rounded-lg text-sm font-medium
                hover:bg-kore-ink/90 transition-colors
              "
            >
              <Pencil size={16} />
              Bearbeiten starten
            </button>
          )}
        </div>
      ) : (
        /* Tree view */
        <div className="overflow-x-auto pb-8">
          <div className="inline-flex gap-12 min-w-min px-4 pt-4">
            {tree.map((rootNode) => (
              <OrgNode
                key={rootNode.user.id}
                node={rootNode}
                isEditMode={isEditMode}
                onAssignManager={handleAssignManager}
                selectedUserId={selectedUserId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Manager assignment modal */}
      <ManagerModal
        isOpen={selectedUserId !== null}
        onClose={handleCloseModal}
        targetUser={targetUser}
        allUsers={users ?? []}
        onSelectManager={handleSelectManager}
        isPending={setManagerMutation.isPending}
        errorMessage={mutationError}
      />
    </div>
  );
}
