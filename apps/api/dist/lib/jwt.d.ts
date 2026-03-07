export interface JWTPayload {
    sub: string;
    tenantId: string | null;
    role: string;
    impersonatedBy?: string;
    iat: number;
    exp: number;
}
export declare function signAccessToken(payload: {
    sub: string;
    tenantId: string | null;
    role: string;
    impersonatedBy?: string;
}): string;
export declare function signRefreshToken(sub: string): string;
export declare function verifyAccessToken(token: string): JWTPayload;
export declare function verifyRefreshToken(token: string): {
    sub: string;
};
//# sourceMappingURL=jwt.d.ts.map