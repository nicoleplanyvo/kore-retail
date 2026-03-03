import { Router, type Router as RouterType } from 'express';
import { contactFormSchema } from '@kore/validators';
import {
  resend,
  contactNotificationEmail,
  contactConfirmationEmail,
} from '../lib/resend.js';

export const contactRouter: RouterType = Router();

contactRouter.post('/', async (req, res) => {
  try {
    // Validate
    const result = contactFormSchema.safeParse(req.body);
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
        resend.emails.send(contactNotificationEmail(data)),
        resend.emails.send(contactConfirmationEmail(data)),
      ]);

      if (notification.error || confirmation.error) {
        console.error('Resend error:', notification.error || confirmation.error);
        res.status(500).json({ error: 'E-Mail konnte nicht gesendet werden.' });
        return;
      }
    } else {
      console.log('[DEV] Contact form submission:', data);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Contact route error:', err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});
