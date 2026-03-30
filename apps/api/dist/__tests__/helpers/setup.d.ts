import prisma from '../../lib/prisma.js';
export { prisma };
export declare function createTenant(name: string, slug?: string): Promise<{
    name: string;
    status: string;
    slug: string;
    contactEmail: string | null;
    contactName: string | null;
    contactPhone: string | null;
    maxUsers: number;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    logoUrl: string | null;
}>;
export interface CreateUserOptions {
    email: string;
    name: string;
    role: string;
    tenantId?: string;
    password?: string;
    isActive?: boolean;
}
export declare function createUser(opts: CreateUserOptions): Promise<{
    name: string;
    email: string;
    tenantId: string | null;
    role: string;
    isActive: boolean;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    passwordHash: string;
    lastLoginAt: Date | null;
}>;
export declare function tokenFor(user: {
    id: string;
    tenantId: string | null;
    role: string;
}, impersonatedBy?: string): string;
export declare function seedTwoTenants(): Promise<{
    tenantA: {
        name: string;
        status: string;
        slug: string;
        contactEmail: string | null;
        contactName: string | null;
        contactPhone: string | null;
        maxUsers: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
    };
    tenantB: {
        name: string;
        status: string;
        slug: string;
        contactEmail: string | null;
        contactName: string | null;
        contactPhone: string | null;
        maxUsers: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        logoUrl: string | null;
    };
    adminA: {
        name: string;
        email: string;
        tenantId: string | null;
        role: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        passwordHash: string;
        lastLoginAt: Date | null;
    };
    learnerA: {
        name: string;
        email: string;
        tenantId: string | null;
        role: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        passwordHash: string;
        lastLoginAt: Date | null;
    };
    adminB: {
        name: string;
        email: string;
        tenantId: string | null;
        role: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        passwordHash: string;
        lastLoginAt: Date | null;
    };
    learnerB: {
        name: string;
        email: string;
        tenantId: string | null;
        role: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        passwordHash: string;
        lastLoginAt: Date | null;
    };
    koreAdmin: {
        name: string;
        email: string;
        tenantId: string | null;
        role: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        passwordHash: string;
        lastLoginAt: Date | null;
    };
    tokenAdminA: string;
    tokenLearnerA: string;
    tokenAdminB: string;
    tokenLearnerB: string;
    tokenKoreAdmin: string;
}>;
//# sourceMappingURL=setup.d.ts.map