import type { OrgUser } from '../../hooks/useOrgchart';
import type { OrgTreeNode } from './types';
import { ROLE_ORDER } from './constants';

/**
 * Sort users by role hierarchy (highest first), then alphabetically.
 * Returns a new sorted array (no mutation).
 */
function sortByRoleThenName(users: readonly OrgUser[]): OrgUser[] {
  return [...users].sort((a, b) => {
    const roleA = ROLE_ORDER[a.role] ?? 99;
    const roleB = ROLE_ORDER[b.role] ?? 99;
    if (roleA !== roleB) return roleA - roleB;
    return a.name.localeCompare(b.name, 'de');
  });
}

/**
 * Build a tree structure from a flat list of users.
 * Users whose managerId points to a user not in the list are treated as roots.
 */
export function buildOrgTree(users: readonly OrgUser[]): readonly OrgTreeNode[] {
  const userIds = new Set(users.map((u) => u.id));

  // Group children by parent ID (null = root)
  const childrenByParent = new Map<string | null, OrgUser[]>();

  for (const user of users) {
    const parentKey =
      user.managerId && userIds.has(user.managerId) ? user.managerId : null;
    const existing = childrenByParent.get(parentKey);
    if (existing) {
      existing.push(user);
    } else {
      childrenByParent.set(parentKey, [user]);
    }
  }

  // Recursive tree builder
  function buildNode(user: OrgUser): OrgTreeNode {
    const rawChildren = childrenByParent.get(user.id) ?? [];
    const sorted = sortByRoleThenName(rawChildren);
    return {
      user,
      children: sorted.map(buildNode),
    };
  }

  const roots = sortByRoleThenName(childrenByParent.get(null) ?? []);
  return roots.map(buildNode);
}

/** Get the total count of descendants for a node (for collapse info) */
export function countDescendants(node: OrgTreeNode): number {
  let count = node.children.length;
  for (const child of node.children) {
    count += countDescendants(child);
  }
  return count;
}
