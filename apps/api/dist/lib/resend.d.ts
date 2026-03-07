import { Resend } from 'resend';
export declare const resend: Resend | null;
export declare function contactNotificationEmail(data: {
    name: string;
    email: string;
    company?: string;
    message: string;
}): {
    from: string;
    to: string;
    subject: string;
    html: string;
};
export declare function contactConfirmationEmail(data: {
    name: string;
    email: string;
}): {
    from: string;
    to: string;
    subject: string;
    html: string;
};
export declare function auditNotificationEmail(data: {
    name: string;
    email: string;
    company: string;
    storeCount: string;
    challenge: string;
}): {
    from: string;
    to: string;
    subject: string;
    html: string;
};
export declare function auditConfirmationEmail(data: {
    name: string;
    email: string;
    company: string;
}): {
    from: string;
    to: string;
    subject: string;
    html: string;
};
//# sourceMappingURL=resend.d.ts.map