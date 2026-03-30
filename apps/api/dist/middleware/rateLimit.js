export function rateLimit(options) {
    const { windowMs, max, message = 'Zu viele Anfragen. Bitte versuche es später erneut.' } = options;
    const store = new Map();
    // Cleanup abgelaufener Einträge alle 60s
    const cleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of store) {
            if (entry.resetAt <= now) {
                store.delete(key);
            }
        }
    }, 60_000);
    // Verhindere dass der Timer den Prozess am Leben hält
    if (cleanupInterval.unref)
        cleanupInterval.unref();
    return (req, res, next) => {
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        let entry = store.get(ip);
        if (!entry || entry.resetAt <= now) {
            entry = { count: 1, resetAt: now + windowMs };
            store.set(ip, entry);
            return next();
        }
        entry.count++;
        if (entry.count > max) {
            const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
            res.set('Retry-After', String(retryAfter));
            res.status(429).json({ error: message });
            return;
        }
        next();
    };
}
/** Strikte Begrenzung für Auth-Endpoints: 10 Versuche pro 15 Minuten */
export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Zu viele Anmeldeversuche. Bitte warte 15 Minuten.',
});
/** Moderate Begrenzung für Passwort-Endpoints: 5 Versuche pro 15 Minuten */
export const passwordRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Zu viele Anfragen. Bitte warte 15 Minuten.',
});
//# sourceMappingURL=rateLimit.js.map