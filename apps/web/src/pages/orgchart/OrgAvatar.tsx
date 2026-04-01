import type { OrgUser } from '../../hooks/useOrgchart';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

interface OrgAvatarProps {
  readonly user: OrgUser;
  readonly size?: 'sm' | 'md';
}

const SIZES = {
  sm: 'w-8 h-8 text-[0.6rem]',
  md: 'w-10 h-10 text-xs',
} as const;

export function OrgAvatar({ user, size = 'md' }: OrgAvatarProps) {
  const sizeClass = SIZES[size];

  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-kore-surface flex items-center justify-center flex-shrink-0`}
    >
      <span className="font-medium text-kore-mid">{getInitials(user.name)}</span>
    </div>
  );
}
