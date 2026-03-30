import { type Router as RouterType } from 'express';
export declare const adminTenantsRouter: RouterType;
/**
 * Separate router for branding endpoints.
 * Mounted at /api/admin/tenants in index.ts (same path), but uses
 * authenticate + requireMinRole('tenant_admin') instead of kore_admin.
 * We export it separately and mount it alongside adminTenantsRouter.
 */
export declare const tenantBrandingRouter: RouterType;
//# sourceMappingURL=tenants.d.ts.map