import { Resend } from 'resend';
const apiKey = process.env['RESEND_API_KEY'];
if (!apiKey) {
    console.warn('⚠ RESEND_API_KEY nicht gesetzt — E-Mails werden nur geloggt.');
}
export const resend = apiKey ? new Resend(apiKey) : null;
const FROM = process.env['FROM_EMAIL'] ?? 'noreply@kore-retail.de';
const NOTIFY = process.env['NOTIFICATION_EMAIL'] ?? 'hello@planyvo.com';
// ──────────────────────────────────────────────
// E-Mail-Templates
// ──────────────────────────────────────────────
function baseLayout(content) {
    return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin: 0; padding: 0; background-color: #F7F4EF; font-family: 'Jost', 'Helvetica Neue', Arial, sans-serif; color: #1C1A17; }
    .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
    .header { border-bottom: 2px solid #9E8460; padding-bottom: 20px; margin-bottom: 32px; }
    .logo { font-family: 'Cormorant', Georgia, serif; font-size: 28px; font-weight: 300; letter-spacing: 2px; color: #1C1A17; }
    .content { font-size: 15px; line-height: 1.7; color: #524E46; }
    .content h2 { font-family: 'Cormorant', Georgia, serif; font-size: 22px; font-weight: 400; color: #1C1A17; margin: 0 0 16px 0; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #9E8460; font-weight: 500; margin-bottom: 4px; }
    .field { background: #FDFCFA; border: 1px solid #D8D4CC; padding: 12px 16px; margin-bottom: 12px; font-size: 14px; line-height: 1.6; color: #1C1A17; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #D8D4CC; font-size: 12px; color: #9E8460; }
    .brass-line { width: 48px; height: 2px; background: #9E8460; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">KORE</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      KORE — Retail Intelligence<br/>
      Eine Marke der planyvo GmbH<br/>
      Rudolf-Diesel-Str. 5, 40670 Meerbusch
    </div>
  </div>
</body>
</html>`;
}
// ──────────────────────────────────────────────
// Kontaktformular
// ──────────────────────────────────────────────
export function contactNotificationEmail(data) {
    return {
        from: `KORE <${FROM}>`,
        to: NOTIFY,
        subject: `Neue KORE Kontaktanfrage: ${data.name}`,
        html: baseLayout(`
      <h2>Neue Kontaktanfrage</h2>
      <div class="label">Name</div>
      <div class="field">${escapeHtml(data.name)}</div>
      <div class="label">E-Mail</div>
      <div class="field"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
      ${data.company ? `<div class="label">Unternehmen</div><div class="field">${escapeHtml(data.company)}</div>` : ''}
      <div class="label">Nachricht</div>
      <div class="field">${escapeHtml(data.message).replace(/\n/g, '<br/>')}</div>
    `),
    };
}
export function contactConfirmationEmail(data) {
    return {
        from: `KORE <${FROM}>`,
        to: data.email,
        subject: 'Ihre Anfrage bei KORE',
        html: baseLayout(`
      <h2>Vielen Dank, ${escapeHtml(data.name)}.</h2>
      <p>Wir haben Ihre Anfrage erhalten und melden uns in der Regel innerhalb von 24 Stunden bei Ihnen.</p>
      <div class="brass-line"></div>
      <p>Falls Sie in der Zwischenzeit Fragen haben, erreichen Sie uns jederzeit unter <a href="mailto:hello@planyvo.com">hello@planyvo.com</a>.</p>
      <p style="margin-top: 24px; color: #9E8460; font-style: italic;">
        Mit besten Grüßen,<br/>
        Nicole Muñoz Bonilla<br/>
        KORE — Retail Intelligence
      </p>
    `),
    };
}
// ──────────────────────────────────────────────
// Audit-Anfrage
// ──────────────────────────────────────────────
export function auditNotificationEmail(data) {
    return {
        from: `KORE <${FROM}>`,
        to: NOTIFY,
        subject: `Neue KORE Audit-Anfrage: ${data.company}`,
        html: baseLayout(`
      <h2>Neue Audit-Anfrage</h2>
      <div class="label">Name</div>
      <div class="field">${escapeHtml(data.name)}</div>
      <div class="label">Unternehmen</div>
      <div class="field">${escapeHtml(data.company)}</div>
      <div class="label">E-Mail</div>
      <div class="field"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
      <div class="label">Anzahl Stores</div>
      <div class="field">${escapeHtml(data.storeCount)}</div>
      <div class="label">Herausforderung</div>
      <div class="field">${escapeHtml(data.challenge).replace(/\n/g, '<br/>')}</div>
    `),
    };
}
export function auditConfirmationEmail(data) {
    return {
        from: `KORE <${FROM}>`,
        to: data.email,
        subject: 'Ihre Audit-Anfrage bei KORE',
        html: baseLayout(`
      <h2>Vielen Dank, ${escapeHtml(data.name)}.</h2>
      <p>Wir haben Ihre Audit-Anfrage für <strong>${escapeHtml(data.company)}</strong> erhalten.</p>
      <div class="brass-line"></div>
      <p><strong>Wie geht es weiter?</strong></p>
      <p>Wir melden uns innerhalb von 24 Stunden bei Ihnen, um einen Termin für ein erstes Gespräch zu vereinbaren. Dabei besprechen wir Ihre Herausforderungen und klären den Rahmen für das Audit.</p>
      <p style="margin-top: 24px; color: #9E8460; font-style: italic;">
        Mit besten Grüßen,<br/>
        Nicole Muñoz Bonilla<br/>
        KORE — Retail Intelligence
      </p>
    `),
    };
}
// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
//# sourceMappingURL=resend.js.map