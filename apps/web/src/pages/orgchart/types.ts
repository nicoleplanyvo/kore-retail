import type { OrgUser } from '../../hooks/useOrgchart';

/** A node in the org tree with pre-resolved children */
export interface OrgTreeNode {
  readonly user: OrgUser;
  readonly children: readonly OrgTreeNode[];
}

/** Role display configuration */
export interface RoleStyle {
  readonly bg: string;
  readonly text: string;
  readonly border: string;
}
