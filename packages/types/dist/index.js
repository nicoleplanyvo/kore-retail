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
/** Prüft ob creator eine Rolle STRIKT unter sich erstellen kann */
export function canCreateRole(creatorRole, targetRole) {
    return ROLE_HIERARCHY.indexOf(creatorRole) < ROLE_HIERARCHY.indexOf(targetRole);
}
/** Gibt alle Rollen zurück, die ein User erstellen kann (strikt unterhalb) */
export function getCreatableRoles(creatorRole) {
    const idx = ROLE_HIERARCHY.indexOf(creatorRole);
    return ROLE_HIERARCHY.slice(idx + 1);
}
//# sourceMappingURL=index.js.map