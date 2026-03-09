import { Router } from 'express';
import { auditRequestSchema } from '@kore/validators';
import { resend, auditNotificationEmail, auditConfirmationEmail, } from '../lib/resend.js';
export const auditRouter = Router();
auditRouter.post('/', async (req, res) => {
    try {
        // Validate
        const result = auditRequestSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                error: 'Validierungsfehler',
                details: result.error.flatten().fieldErrors,
            });
            return;
        }
        const data = result.data;
        // Send emails
        if (resend) {
            const [notification, confirmation] = await Promise.all([
                resend.emails.send(auditNotificationEmail(data)),
                resend.emails.send(auditConfirmationEmail(data)),
            ]);
            if (notification.error || confirmation.error) {
                console.error('Resend error:', notification.error || confirmation.error);
                res.status(500).json({ error: 'E-Mail konnte nicht gesendet werden.' });
                return;
            }
        }
        else {
            console.log('[DEV] Audit form submission:', data);
        }
        res.json({ success: true });
    }
    catch (err) {
        console.error('Audit route error:', err);
        res.status(500).json({ error: 'Interner Serverfehler.' });
    }
});
//# sourceMappingURL=audit.js.map