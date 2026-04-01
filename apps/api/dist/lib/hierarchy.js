import prisma from './prisma.js';
/**
 * Recursively collects all subordinate user IDs for a given manager.
 * Traverses the managerId chain downwards through the org chart.
 */
export async function getSubordinateIds(userId, tenantId) {
    const allUsers = await prisma.user.findMany({
        where: { tenantId, isActive: true },
        select: { id: true, managerId: true },
    });
    const subordinates = [];
    function collectReports(managerId) {
        for (const user of allUsers) {
            if (user.managerId === managerId) {
                subordinates.push(user.id);
                collectReports(user.id);
            }
        }
    }
    collectReports(userId);
    return subordinates;
}
//# sourceMappingURL=hierarchy.js.map