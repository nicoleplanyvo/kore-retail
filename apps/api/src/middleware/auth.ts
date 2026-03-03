import type { Request, Response, NextFunction } from 'express';
import type { UserRole } from '@prisma/client';
import { verifyAccessToken, type JWTPayload } from '../lib/jwt.js';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers['authorization'];
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Nicht authentifiziert.' });
    return;
  }

  const token = header.slice(7);
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Token ungültig oder abgelaufen.' });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Nicht authentifiziert.' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Keine Berechtigung.' });
      return;
    }
    next();
  };
}
