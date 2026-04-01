/**
 * Recursively collects all subordinate user IDs for a given manager.
 * Traverses the managerId chain downwards through the org chart.
 */
export declare function getSubordinateIds(userId: string, tenantId: string): Promise<string[]>;
//# sourceMappingURL=hierarchy.d.ts.map