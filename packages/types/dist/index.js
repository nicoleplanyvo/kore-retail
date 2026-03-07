// === User & Auth ===
/** Hierarchie: Index 0 = höchste Berechtigung */
export const ROLE_HIERARCHY = [
    'kore_admin',
    'tenant_admin',
    'regional_manager',
    'multisite_manager',
    'store_manager',
    'learner',
];
/** Prüft ob roleA ≥ roleB in der Hierarchie */
export function hasMinRole(userRole, requiredRole) {
    return ROLE_HIERARCHY.indexOf(userRole) <= ROLE_HIERARCHY.indexOf(requiredRole);
}
//# sourceMappingURL=index.js.map