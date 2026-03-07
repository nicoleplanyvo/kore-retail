interface AuditInput {
    tenantId?: string | null;
    userId?: string | null;
    action: string;
    entity: string;
    entityId?: string | null;
    details?: string | null;
    ipAddress?: string | null;
}
export declare function logAudit(input: AuditInput): Promise<void>;
export {};
//# sourceMappingURL=audit.d.ts.map