import { Pencil } from 'lucide-react';
import type { OrgUser } from '../../hooks/useOrgchart';
import { OrgAvatar } from './OrgAvatar';
import { ROLE_STYLES, ROLE_LABELS, DEFAULT_ROLE_STYLE } from './constants';

interface OrgCardProps {
  readonly user: OrgUser;
  readonly isEditMode: boolean;
  readonly onAssignManager: (userId: string) => void;
  readonly isSelected?: boolean;
}

export function OrgCard({ user, isEditMode, onAssignManager, isSelected }: OrgCardProps) {
  const style = ROLE_STYLES[user.role] ?? DEFAULT_ROLE_STYLE;
  const roleLabel = ROLE_LABELS[user.role] ?? user.role;

  return (
    <div
      className={`
        bg-white rounded-lg border-2 p-3 w-[180px] text-center
        shadow-sm hover:shadow-md transition-all duration-200
        ${isSelected ? 'ring-2 ring-kore-brass ring-offset-2' : ''}
        ${style.border}
      `}
    >
      <div className="flex justify-center mb-2">
        <OrgAvatar user={user} />
      </div>

      <p className="font-body text-sm font-semibold text-kore-ink truncate leading-tight">
        {user.name}
      </p>

      <span
        className={`
          inline-block mt-1.5 px-2.5 py-0.5 rounded-full
          text-[0.65rem] font-semibold tracking-wide uppercase
          ${style.bg} ${style.text}
        `}
      >
        {roleLabel}
      </span>

      {user.storeNames.length > 0 && (
        <p
          className="font-body text-[0.65rem] text-kore-mid mt-1.5 truncate"
          title={user.storeNames.join(', ')}
        >
          {user.storeNames.join(', ')}
        </p>
      )}

      {isEditMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAssignManager(user.id);
          }}
          className="
            mt-2.5 inline-flex items-center gap-1 px-2.5 py-1
            text-[0.65rem] font-medium text-kore-brass
            bg-kore-brass/5 hover:bg-kore-brass/10
            rounded-md transition-colors
          "
        >
          <Pencil size={10} />
          Vorgesetzten zuweisen
        </button>
      )}
    </div>
  );
}
