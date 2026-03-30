import { Users } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { Skeleton } from '../components/Skeleton';
import { useOrgchart, type OrgUser } from '../hooks/useOrgchart';

// ── Role styling ──────────────────────────────────────────
const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  kore_admin:        { bg: 'bg-kore-brass/10', text: 'text-kore-brass' },
  tenant_admin:      { bg: 'bg-purple-500/10', text: 'text-purple-700' },
  regional_manager:  { bg: 'bg-blue-500/10', text: 'text-blue-700' },
  multisite_manager: { bg: 'bg-teal-500/10', text: 'text-teal-700' },
  store_manager:     { bg: 'bg-emerald-500/10', text: 'text-emerald-700' },
  learner:           { bg: 'bg-gray-100', text: 'text-gray-600' },
};

const ROLE_LABELS: Record<string, string> = {
  kore_admin: 'Admin',
  tenant_admin: 'Kunden-Admin',
  regional_manager: 'Regional',
  multisite_manager: 'Multisite',
  store_manager: 'Store Manager',
  learner: 'Mitarbeiter',
};

// ── Role hierarchy for sorting ────────────────────────────
const ROLE_ORDER: Record<string, number> = {
  kore_admin: 0,
  tenant_admin: 1,
  regional_manager: 2,
  multisite_manager: 3,
  store_manager: 4,
  learner: 5,
};

// ── Helpers ───────────────────────────────────────────────
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function buildChildrenMap(users: OrgUser[]): Map<string | null, OrgUser[]> {
  const userIds = new Set(users.map((u) => u.id));
  const map = new Map<string | null, OrgUser[]>();

  for (const user of users) {
    // If managerId is null or the manager isn't in the list, treat as root
    const parentKey = user.managerId && userIds.has(user.managerId) ? user.managerId : null;
    const existing = map.get(parentKey);
    if (existing) {
      existing.push(user);
    } else {
      map.set(parentKey, [user]);
    }
  }

  // Sort children within each group by role hierarchy, then by name
  for (const [, children] of map) {
    children.sort((a, b) => {
      const roleA = ROLE_ORDER[a.role] ?? 99;
      const roleB = ROLE_ORDER[b.role] ?? 99;
      if (roleA !== roleB) return roleA - roleB;
      return a.name.localeCompare(b.name, 'de');
    });
  }

  return map;
}

// ── Avatar ────────────────────────────────────────────────
function Avatar({ user }: { user: OrgUser }) {
  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-kore-surface flex items-center justify-center flex-shrink-0">
      <span className="text-[0.65rem] font-medium text-kore-mid">
        {getInitials(user.name)}
      </span>
    </div>
  );
}

// ── User card ─────────────────────────────────────────────
function UserCard({ user }: { user: OrgUser }) {
  const roleColor = ROLE_COLORS[user.role] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  const roleLabel = ROLE_LABELS[user.role] || user.role;

  return (
    <div className="bg-white border border-kore-border rounded-lg p-3 min-w-[160px] max-w-[200px] text-center shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-center mb-1.5">
        <Avatar user={user} />
      </div>
      <p className="font-body text-small font-medium text-kore-ink truncate">{user.name}</p>
      <span
        className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[0.6rem] font-medium ${roleColor.bg} ${roleColor.text}`}
      >
        {roleLabel}
      </span>
      {user.storeNames.length > 0 && (
        <p className="font-body text-[0.6rem] text-kore-mid mt-1 truncate" title={user.storeNames.join(', ')}>
          {user.storeNames.join(', ')}
        </p>
      )}
    </div>
  );
}

// ── Recursive tree node ───────────────────────────────────
function OrgNode({
  user,
  childrenMap,
}: {
  user: OrgUser;
  childrenMap: Map<string | null, OrgUser[]>;
}) {
  const children = childrenMap.get(user.id) || [];

  return (
    <div className="flex flex-col items-center">
      <UserCard user={user} />

      {children.length > 0 && (
        <>
          {/* Vertical line from parent down */}
          <div className="w-px h-6 bg-kore-border" />

          {/* Horizontal connector bar + children */}
          <div className="flex gap-0">
            {children.map((child, i) => (
              <div key={child.id} className="flex flex-col items-center relative px-4">
                {/* Horizontal connector line */}
                {children.length > 1 && (
                  <div
                    className={`absolute top-0 h-px bg-kore-border ${
                      i === 0
                        ? 'left-1/2 right-0'
                        : i === children.length - 1
                          ? 'left-0 right-1/2'
                          : 'left-0 right-0'
                    }`}
                  />
                )}

                {/* Vertical line down to child card */}
                <div className="w-px h-6 bg-kore-border" />

                <OrgNode user={child} childrenMap={childrenMap} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────
function OrgchartSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {/* Root card */}
      <div className="border border-kore-border rounded-lg p-3 w-[180px] flex flex-col items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="w-px h-6" />
      {/* Second level */}
      <div className="flex gap-8">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex flex-col items-center gap-2">
            <Skeleton className="w-px h-6" />
            <div className="border border-kore-border rounded-lg p-3 w-[160px] flex flex-col items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────
export function OrgchartPage() {
  const { data: users, isLoading, error } = useOrgchart();

  const childrenMap = users ? buildChildrenMap(users) : new Map<string | null, OrgUser[]>();
  const roots = childrenMap.get(null) || [];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Organigramm' }]} />

      {/* Page header */}
      <div className="flex items-center gap-md mb-xl">
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

      {/* Content */}
      {isLoading ? (
        <OrgchartSkeleton />
      ) : error ? (
        <div className="bg-white border border-red-200 rounded-lg p-2xl text-center">
          <p className="font-body text-small text-red-600">
            Organigramm konnte nicht geladen werden.
          </p>
        </div>
      ) : !users || users.length === 0 ? (
        <div className="bg-white border border-kore-border rounded-lg p-2xl text-center">
          <Users size={32} className="text-kore-mid/30 mx-auto mb-md" />
          <p className="font-body text-kore-mid">Keine Mitarbeiter gefunden.</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-8">
          <div className="inline-flex gap-12 min-w-min px-4 pt-4">
            {roots.map((root) => (
              <OrgNode key={root.id} user={root} childrenMap={childrenMap} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
