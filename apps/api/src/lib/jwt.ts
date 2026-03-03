import jwt from 'jsonwebtoken';
import type { UserRole, Plan } from '@prisma/client';

export interface JWTPayload {
  sub: string;
  tenantId: string | null;
  role: UserRole;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'dev-secret-key-min-32-characters-long';
const JWT_REFRESH_SECRET = process.env['JWT_REFRESH_SECRET'] ?? 'dev-refresh-secret-min-32-chars-long';

export function signAccessToken(payload: { sub: string; tenantId: string | null; role: UserRole }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(sub: string): string {
  return jwt.sign({ sub }, JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { sub: string };
}
