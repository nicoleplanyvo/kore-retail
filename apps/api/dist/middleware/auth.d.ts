import type { Request, Response, NextFunction } from 'express';
import { type JWTPayload } from '../lib/jwt.js';
import { type UserRole } from '@kore/types';
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}
export declare function authenticate(req: Request, res: Response, next: NextFunction): void;
/** Prüft ob User exakt eine der angegebenen Rollen hat */
export declare function requireRole(...roles: string[]): (req: Request, res: Response, next: NextFunction) => void;
/** Prüft ob User mindestens die angegebene Rolle hat (hierarchisch) */
export declare function requireMinRole(minRole: UserRole): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Prüft Tenant-Zugriff:
 * - kore_admin: Zugriff auf alle Tenants
 * - Andere: Nur eigener Tenant (tenantId aus JWT muss req.params.tenantId/id matchen)
 *
 * Sucht den Tenant-Bezug in: req.params.tenantId, req.params.id (für Tenant-Routen), req.body.tenantId
 */
export declare function requireTenantAccess(): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Prüft Store-Zugriff:
 * - kore_admin: alle Stores
 * - tenant_admin: alle Stores des eigenen Tenants
 * - Andere: nur zugewiesene Stores (UserStoreAssignment)
 *
 * Erwartet Store-ID in req.params.id oder req.params.storeId
 */
export declare function requireStoreAccess(): (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Helper: Gibt alle Store-IDs zurück, auf die ein User Zugriff hat
 */
export declare function getAccessibleStoreIds(userId: string, tenantId: string | null, role: string): Promise<string[] | 'all'>;
//# sourceMappingURL=auth.d.ts.map