import type { Request, Response, NextFunction } from 'express';
/**
 * Middleware-Factory: Prüft ob der User Zugriff auf mindestens einen Store hat,
 * der das angegebene Tool (per ToolDefinition.key) freigeschaltet hat.
 *
 * Setzt req.tenantId und req.toolStoreIds für nachfolgende Handler.
 * kore_admin bypassed den Tool-Check nicht — auch Admins brauchen zugewiesene Stores.
 *
 * Verwendung: router.use(authenticate, requireToolAccess('standards.excellence_tracker'))
 */
export declare function requireToolAccess(toolKey: string): (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=requireToolAccess.d.ts.map