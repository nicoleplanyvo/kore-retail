/**
 * E-Mail-Versand über Lettermint API
 * https://api.lettermint.co/v1/send
 */
interface EmailPayload {
    from: string;
    to: string | string[];
    subject: string;
    html: string;
    reply_to?: string;
}
interface SendResult {
    success: boolean;
    messageId?: string;
    error?: string;
}
export declare function sendEmail(payload: EmailPayload): Promise<SendResult>;
export declare function contactNotificationEmail(data: {
    name: string;
    email: string;
    company?: string;
    message: string;
}): EmailPayload;
export declare function contactConfirmationEmail(data: {
    name: string;
    email: string;
}): EmailPayload;
export declare function auditNotificationEmail(data: {
    name: string;
    email: string;
    company: string;
    storeCount: string;
    challenge: string;
}): EmailPayload;
export declare function auditConfirmationEmail(data: {
    name: string;
    email: string;
    company: string;
}): EmailPayload;
export {};
//# sourceMappingURL=email.d.ts.map