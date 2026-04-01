import type { RoleStyle } from './types';

export const ROLE_STYLES: Record<string, RoleStyle> = {
  kore_admin:        { bg: 'bg-amber-50',   text: 'text-amber-800',   border: 'border-amber-200' },
  tenant_admin:      { bg: 'bg-purple-50',  text: 'text-purple-800',  border: 'border-purple-200' },
  regional_manager:  { bg: 'bg-blue-50',    text: 'text-blue-800',    border: 'border-blue-200' },
  multisite_manager: { bg: 'bg-teal-50',    text: 'text-teal-800',    border: 'border-teal-200' },
  store_manager:     { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  learner:           { bg: 'bg-slate-50',   text: 'text-slate-700',   border: 'border-slate-200' },
};

export const ROLE_LABELS: Record<string, string> = {
  kore_admin:        'Admin',
  tenant_admin:      'Admin',
  regional_manager:  'Regionalleiter',
  multisite_manager: 'Multisite-Leiter',
  store_manager:     'Filialleiter',
  learner:           'Mitarbeiter',
};

/** Sort priority: lower index = higher in tree */
export const ROLE_ORDER: Record<string, number> = {
  kore_admin:        0,
  tenant_admin:      1,
  regional_manager:  2,
  multisite_manager: 3,
  store_manager:     4,
  learner:           5,
};

export const DEFAULT_ROLE_STYLE: RoleStyle = {
  bg: 'bg-gray-50',
  text: 'text-gray-700',
  border: 'border-gray-200',
};
