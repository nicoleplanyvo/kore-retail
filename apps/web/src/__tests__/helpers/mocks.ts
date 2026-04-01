import type { AuthUser } from '@kore/types';

export function mockAuthUser(overrides?: Partial<AuthUser>): AuthUser {
  return {
    id: 'test-user-1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'store_manager',
    tenantId: 'test-tenant-1',
    storeAssignments: ['store-1'],
    regionAssignments: [],
    tenantBranding: {
      tenantName: 'Test Tenant',
      logoUrl: null,
      primaryColor: null,
      accentColor: null,
    },
    ...overrides,
  };
}
