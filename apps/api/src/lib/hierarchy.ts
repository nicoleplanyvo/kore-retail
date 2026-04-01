import prisma from './prisma.js';

/**
 * Recursively collects all subordinate user IDs for a given manager.
 * Traverses the managerId chain downwards through the org chart.
 */
export async function getSubordinateIds(
  userId: string,
  tenantId: string,
): Promise<string[]> {
  const allUsers = await prisma.user.findMany({
    where: { tenantId, isActive: true },
    select: { id: true, managerId: true },
  });

  const subordinates: string[] = [];

  function collectReports(managerId: string): void {
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
