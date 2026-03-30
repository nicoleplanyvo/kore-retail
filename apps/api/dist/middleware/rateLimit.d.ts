import type { Request, Response, NextFunction } from 'express';
/**
 * Einfache In-Memory Rate-Limiting Middleware.
 * Begrenzt Anfragen pro IP innerhalb eines Zeitfensters.
 */
interface RateLimitOptions {
    /** Zeitfenster in Millisekunden */
    windowMs: number;
    /** Max. Anfragen pro IP im Zeitfenster */
    max: number;
    /** Fehlermeldung */
    message?: string;
}
export declare function rateLimit(options: RateLimitOptions): (req: Request, res: Response, next: NextFunction) => void;
/** Strikte Begrenzung für Auth-Endpoints: 10 Versuche pro 15 Minuten */
export declare const authRateLimit: (req: Request, res: Response, next: NextFunction) => void;
/** Moderate Begrenzung für Passwort-Endpoints: 5 Versuche pro 15 Minuten */
export declare const passwordRateLimit: (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=rateLimit.d.ts.map