import prisma from './prisma.js';
export async function logAudit(input) {
    try {
        await prisma.auditLog.create({
            data: {
                tenantId: input.tenantId ?? null,
                userId: input.userId ?? null,
                action: input.action,
                entity: input.entity,
                entityId: input.entityId ?? null,
                details: input.details ?? null,
                ipAddress: input.ipAddress ?? null,
            },
        });
    }
    catch (err) {
        // Audit-Log-Fehler sollen die Hauptoperation nicht blockieren
        console.error('Audit log error:', err);
    }
}
//# sourceMappingURL=audit.js.map